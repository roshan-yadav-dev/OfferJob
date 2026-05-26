package com.jobportal.notification_service.service;

import com.jobportal.notification_service.dto.ApplicationStatusRequest;
import com.jobportal.notification_service.dto.EmailNotificationRequest;

public interface EmailService {

    void sendEmail(EmailNotificationRequest request);
    void sendApplicationStatusEmail(
        ApplicationStatusRequest request
);
}