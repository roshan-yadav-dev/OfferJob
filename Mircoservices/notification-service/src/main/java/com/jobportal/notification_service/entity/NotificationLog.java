package com.jobportal.notification_service.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.jobportal.notification_service.enums.NotificationState;

import lombok.Data;

@Data
@Document(collection = "notifications")
public class NotificationLog {

    @Id
    private String id;

    private String recipient;

    private String subject;

    private String message;

    private String type;

    private NotificationState state;

    private LocalDateTime createdAt;
}