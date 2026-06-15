package com.jobportal.notification_service.service;

public interface ResendEmailService {

    void sendEmail(
        String to,
        String subject,
        String html
    );
}