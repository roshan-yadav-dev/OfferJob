package com.jobportal.notification_service.service;

import com.jobportal.notification_service.dto.ApplicationStatusRequest;
import com.jobportal.notification_service.dto.EmailNotificationRequest;
import com.jobportal.notification_service.enums.NotificationState;
import com.jobportal.notification_service.exception.EmailSendingException;

import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    private final NotificationLogService logService;

    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public void sendEmail(
            EmailNotificationRequest request
    ) {

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

            logService.saveLog(
                    request.getTo(),
                    request.getSubject(),
                    request.getMessage(),
                    "GENERIC_EMAIL",
                    NotificationState.SENT
            );

        } catch (Exception ex) {

    System.err.println("GENERIC EMAIL ERROR");
    ex.printStackTrace();

    logService.saveLog(
            request.getTo(),
            request.getSubject(),
            ex.getMessage(),
            "GENERIC_EMAIL",
            NotificationState.FAILED
    );

    throw new EmailSendingException(
            "Failed to send email",
            ex
    );
}

    }   

    @Override
    public void sendApplicationStatusEmail(
            ApplicationStatusRequest request
    ) {

        try {

            Context context =
                    new Context();

            context.setVariable(
                    "studentName",
                    request.getStudentName()
            );

            context.setVariable(
                    "jobTitle",
                    request.getJobTitle()
            );

            String templateName =
                    request.getStatus().name()
                            .equals("SHORTLISTED")
                    ? "shortlisted-template"
                    : "rejected-template";

            String htmlContent =
                    templateEngine.process(
                            templateName,
                            context
                    );

            MimeMessage mimeMessage =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            true
                    );

            helper.setFrom(senderEmail);

            helper.setTo(request.getTo());

            helper.setSubject(
                    "Application Status Update"
            );

            helper.setText(
                    htmlContent,
                    true
            );

            mailSender.send(mimeMessage);

            logService.saveLog(
                    request.getTo(),
                    "Application Status Update",
                    htmlContent,
                    "APPLICATION_STATUS",
                    NotificationState.SENT
            );

        } catch (Exception ex) {

    System.err.println("APPLICATION STATUS EMAIL ERROR");
    ex.printStackTrace();

    logService.saveLog(
            request.getTo(),
            "Application Status Update",
            ex.getMessage(),
            "APPLICATION_STATUS",
            NotificationState.FAILED
    );

    throw new EmailSendingException(
            "Failed to send status email"
    );
}
    }
}