package com.jobportal.notification_service.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.notification_service.dto.ApiResponse;
import com.jobportal.notification_service.dto.ApplicationStatusRequest;
import com.jobportal.notification_service.dto.EmailNotificationRequest;
import com.jobportal.notification_service.service.EmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/email")
    public ApiResponse sendEmail(
            @Valid
            @RequestBody
            EmailNotificationRequest request
    ) {

        emailService.sendEmail(request);

        return new ApiResponse(
                true,
                "Email sent successfully"
        );
    }

    @PostMapping("/application-status")
public ApiResponse sendApplicationStatusNotification(
        @Valid
        @RequestBody
        ApplicationStatusRequest request
) {

    System.out.println("CONTROLLER HIT");
    System.out.println("EMAIL = " + request.getTo());
    System.out.println("STATUS = " + request.getStatus());

    emailService.sendApplicationStatusEmail(
            request
    );

    return new ApiResponse(
            true,
            "Application status email sent successfully"
    );
}
}