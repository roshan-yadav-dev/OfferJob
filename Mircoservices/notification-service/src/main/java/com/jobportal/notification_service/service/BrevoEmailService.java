package com.jobportal.notification_service.service;

public interface BrevoEmailService {

    void sendEmail(
        String to,
        String subject,
        String html
    );
}
