package com.sahakarseva.service;

import com.sahakarseva.dto.PaymentDto;
import com.sahakarseva.model.Booking;
import com.sahakarseva.model.Payment;
import com.sahakarseva.repository.BookingRepository;
import com.sahakarseva.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final String merchantVpa;
    private final String merchantName;

    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            @Value("${sahakar.payment.upi.merchant-vpa:sahakar.seva@sbi}") String merchantVpa,
            @Value("${sahakar.payment.upi.merchant-name:Sahakar Seva Cooperative Federation}") String merchantName
    ) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.merchantVpa = merchantVpa;
        this.merchantName = merchantName;
    }

    @Transactional
    public PaymentDto.PaymentIntentResponse createPaymentIntent(PaymentDto.PaymentIntentRequest req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found: " + req.getBookingId()));

        BigDecimal total = req.getTotalAmount() != null ? req.getTotalAmount() : booking.getEstimatedPrice();

        // 18% GST + 2% Welfare Fund breakdown
        // Total = BaseFare * 1.20 => BaseFare = Total / 1.20
        BigDecimal baseFare = total.divide(new BigDecimal("1.20"), 2, RoundingMode.HALF_UP);
        BigDecimal gstAmount = baseFare.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal welfareContribution = baseFare.multiply(new BigDecimal("0.02")).setScale(2, RoundingMode.HALF_UP);

        String paymentId = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String txnId = "TXN-" + System.currentTimeMillis();
        String razorpayOrderId = "order_" + UUID.randomUUID().toString().substring(0, 10);

        // Generate dynamic NPCI-standard UPI URI string for QR rendering
        String upiQrString = String.format(
                "upi://pay?pa=%s&pn=%s&am=%.2f&cu=INR&tr=%s&tn=Booking_%s",
                merchantVpa,
                merchantName.replace(" ", "%20"),
                total.doubleValue(),
                txnId,
                booking.getId()
        );

        Payment payment = Payment.builder()
                .id(paymentId)
                .booking(booking)
                .amount(total)
                .baseFare(baseFare)
                .gstAmount(gstAmount)
                .welfareContribution(welfareContribution)
                .paymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "UPI")
                .transactionId(txnId)
                .razorpayOrderId(razorpayOrderId)
                .upiVpa(merchantVpa)
                .status("COMPLETED") // Set to completed for instantaneous seamless demo
                .paidAt(ZonedDateTime.now())
                .build();

        paymentRepository.save(payment);

        return PaymentDto.PaymentIntentResponse.builder()
                .paymentId(paymentId)
                .bookingId(booking.getId())
                .totalAmount(total)
                .baseFare(baseFare)
                .gstAmount(gstAmount)
                .welfareContribution(welfareContribution)
                .paymentMethod(payment.getPaymentMethod())
                .upiQrString(upiQrString)
                .razorpayOrderId(razorpayOrderId)
                .status("COMPLETED")
                .build();
    }

    public PaymentDto.InvoiceResponse generateInvoice(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment record not found for booking: " + bookingId));

        return PaymentDto.InvoiceResponse.builder()
                .invoiceNumber("INV-SKR-" + payment.getTransactionId())
                .bookingId(booking.getId())
                .customerName(booking.getCustomer() != null ? booking.getCustomer().getName() : "Customer")
                .workerName(booking.getWorker() != null && booking.getWorker().getUser() != null
                        ? booking.getWorker().getUser().getName() : "Cooperative Worker")
                .societyName(booking.getWorker() != null && booking.getWorker().getSociety() != null
                        ? booking.getWorker().getSociety().getName() : "Primary Cooperative Society")
                .serviceName(booking.getServiceName())
                .baseFare(payment.getBaseFare())
                .gstRatePercent(new BigDecimal("18.00"))
                .gstAmount(payment.getGstAmount())
                .welfareFundRatePercent(new BigDecimal("2.00"))
                .welfareContribution(payment.getWelfareContribution())
                .grandTotal(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
