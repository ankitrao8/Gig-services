package com.sahakarseva.service;

import com.sahakarseva.model.Notification;
import com.sahakarseva.model.User;
import com.sahakarseva.repository.NotificationRepository;
import com.sahakarseva.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification sendNotification(String userId, String title, String message, String type) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        // Simulate multi-channel priority dispatcher:
        // High priority / emergency messages trigger instant SMS/IVR fallback alongside FCM push
        String channel = (type.contains("EMERGENCY") || type.contains("DISPATCH")) ? "FCM_WITH_SMS_FALLBACK" : "FCM_PUSH";

        Notification notif = Notification.builder()
                .id("NOTIF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .channel(channel)
                .read(false)
                .createdAt(ZonedDateTime.now())
                .build();

        return notificationRepository.save(notif);
    }
}
