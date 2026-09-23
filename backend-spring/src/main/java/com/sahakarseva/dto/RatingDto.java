package com.sahakarseva.dto;

import lombok.*;

public class RatingDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubmitRatingRequest {
        private String bookingId;
        private Integer rating; // 1-5
        private String review;
        private Boolean onTime;
        private Double jobDurationMinutes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RatingAuditResponse {
        private String ratingId;
        private boolean isAnomaly;
        private String riskLevel; // LOW, MEDIUM, HIGH
        private String message;
    }
}
