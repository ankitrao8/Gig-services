package com.sahakarseva.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

public class PaymentDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentIntentRequest {
        private String bookingId;
        private BigDecimal totalAmount;
        private String paymentMethod; // UPI, RAZORPAY, CASH
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentIntentResponse {
        private String paymentId;
        private String bookingId;
        private BigDecimal totalAmount;
        private BigDecimal baseFare;
        private BigDecimal gstAmount; // 18%
        private BigDecimal welfareContribution; // 2%
        private String paymentMethod;
        private String upiQrString; // Dynamic UPI string: upi://pay?pa=...
        private String razorpayOrderId;
        private String status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InvoiceResponse {
        private String invoiceNumber;
        private String bookingId;
        private String customerName;
        private String workerName;
        private String societyName;
        private String serviceName;
        private BigDecimal baseFare;
        private BigDecimal gstRatePercent; // 18%
        private BigDecimal gstAmount;
        private BigDecimal welfareFundRatePercent; // 2%
        private BigDecimal welfareContribution;
        private BigDecimal grandTotal;
        private String paymentMethod;
        private String transactionId;
        private ZonedDateTime paidAt;
    }
}
