package com.sahakarseva.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateBookingRequest {
        private String customerId;
        private String workerId;
        private String serviceName;
        private String bookingType; // INSTANT, SCHEDULED, EMERGENCY
        private LocalDate scheduledDate;
        private String scheduledTime;
        private String address;
        private Double latitude;
        private Double longitude;
        private BigDecimal estimatedPrice;
        private Boolean emergency;
        private String problemDescription;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        private String status; // ACCEPTED, WORKER_ON_WAY, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
