import { Request, Response } from 'express';
import { db } from '../database/store';
import { AuthenticatedRequest } from '../middleware/auth';
import { Payment, PaymentMethod } from '../types';

export class PaymentController {
  public static async processPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { bookingId, amount, paymentMethod } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      res.status(400).json({ success: false, message: 'bookingId, amount, and paymentMethod are required' });
      return;
    }

    const booking = db.bookings.get(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // Fee breakdown:
    // Platform fee: ₹20 fixed
    // Welfare contribution: ₹25 fixed
    // GST: 5% of subtotal
    // Worker earning: remaining balance
    const platformFee = 20;
    const welfareContribution = 25;
    const gst = Math.round(amount * 0.05);
    const workerEarning = Math.max(0, amount - platformFee - welfareContribution - gst);

    const paymentId = `pay-${Date.now().toString().slice(-6)}`;
    const txnId = `TXN-${paymentMethod}-${Date.now()}`;

    const newPayment: Payment = {
      id: paymentId,
      bookingId,
      amount,
      platformFee,
      welfareContribution,
      gst,
      workerEarning,
      paymentMethod: paymentMethod as PaymentMethod,
      transactionId: txnId,
      status: 'COMPLETED',
      paidAt: new Date().toISOString()
    };

    db.payments.set(newPayment.id, newPayment);

    // If booking was IN_PROGRESS, move to COMPLETED
    if (booking.status === 'IN_PROGRESS' || booking.status === 'WORKER_ON_WAY') {
      booking.status = 'COMPLETED';
      booking.finalPrice = amount;
    }

    res.status(201).json({
      success: true,
      message: 'Payment simulated successfully! Digital receipt generated.',
      payment: newPayment,
      invoice: {
        invoiceNumber: `INV-SS-${newPayment.id.toUpperCase()}`,
        platformName: 'Sahakar Seva Cooperative Gig Platform',
        tagline: 'Verified Workers. Fair Work. Trusted Services.',
        bookingId: booking.id,
        customerName: booking.customerName,
        workerName: booking.workerName,
        service: booking.serviceName,
        serviceDate: booking.scheduledDate,
        amountBreakdown: {
          subtotal: amount - gst,
          platformFee,
          welfareFundContribution: welfareContribution,
          gst5Percent: gst,
          totalPaid: amount
        },
        paymentMethod,
        transactionId: txnId,
        paymentStatus: 'PAID',
        paidAt: newPayment.paidAt
      }
    });
  }

  public static async getPaymentByBooking(req: Request, res: Response): Promise<void> {
    const { bookingId } = req.params;
    const payment = Array.from(db.payments.values()).find(p => p.bookingId === bookingId);

    if (!payment) {
      res.status(404).json({ success: false, message: 'No payment record found for this booking' });
      return;
    }

    const booking = db.bookings.get(bookingId);

    res.json({
      success: true,
      payment,
      invoice: {
        invoiceNumber: `INV-SS-${payment.id.toUpperCase()}`,
        platformName: 'Sahakar Seva Cooperative Gig Platform',
        bookingId: booking?.id,
        customerName: booking?.customerName,
        workerName: booking?.workerName,
        service: booking?.serviceName,
        serviceDate: booking?.scheduledDate,
        totalPaid: payment.amount,
        platformFee: payment.platformFee,
        welfareContribution: payment.welfareContribution,
        gst: payment.gst,
        transactionId: payment.transactionId,
        paidAt: payment.paidAt
      }
    });
  }
}
