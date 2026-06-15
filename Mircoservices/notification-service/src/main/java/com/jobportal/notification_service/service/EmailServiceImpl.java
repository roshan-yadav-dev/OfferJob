package com.jobportal.notification_service.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.jobportal.notification_service.dto.ApplicationStatusRequest;
import com.jobportal.notification_service.dto.EmailNotificationRequest;
import com.jobportal.notification_service.enums.NotificationState;
import com.jobportal.notification_service.exception.EmailSendingException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

private final NotificationLogService logService;

private final TemplateEngine templateEngine;

private final ResendEmailService resendEmailService;

@Override
public void sendEmail(
        EmailNotificationRequest request
) {

    try {

        resendEmailService.sendEmail(
                request.getTo(),
                request.getSubject(),
                request.getMessage()
        );

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

        Context context = new Context();

        context.setVariable(
                "studentName",
                request.getStudentName()
        );

        context.setVariable(
                "jobTitle",
                request.getJobTitle()
        );

        String templateName =
                request.getStatus().name().equals("SHORTLISTED")
                        ? "shortlisted-template"
                        : "rejected-template";

        String htmlContent =
                templateEngine.process(
                        templateName,
                        context
                );

        resendEmailService.sendEmail(
                request.getTo(),
                "Application Status Update",
                htmlContent
        );

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
                "Failed to send status email",
                ex
        );
    }
}

}
