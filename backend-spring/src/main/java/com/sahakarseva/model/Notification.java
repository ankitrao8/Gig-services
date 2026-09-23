package com.sahakarseva.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(length = 30)
    @Builder.Default
    private String type = "INFO";

    @Column
    @Builder.Default
    private Boolean read = false;

    @Column(name = "channel", length = 30)
    @Builder.Default
    private String channel = "FCM_PUSH"; // FCM_PUSH, SMS_FALLBACK, IVR_FALLBACK

    @Column(name = "created_at")
    @Builder.Default
    private ZonedDateTime createdAt = ZonedDateTime.now();
}
