package com.jobportal.notification_service.service;

import com.jobportal.notification_service.dto.EmailNotificationRequest;
import com.jobportal.notification_service.exception.EmailSendingException;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public void sendEmail(EmailNotificationRequest request) {

        try {

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setFrom(senderEmail);

            message.setTo(request.getTo());

            message.setSubject(
                    request.getSubject()
            );

            message.setText(
                    request.getMessage()
            );

            mailSender.send(message);

        } catch (Exception ex) {

            throw new EmailSendingException(
                    "Failed to send email"
            );
        }
    }
}