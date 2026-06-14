package com.jobportal.notification_service.dto;

import com.jobportal.notification_service.enums.ApplicationStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationStatusRequest {

    @Email
    @NotBlank
    private String to;

    @NotBlank
    private String studentName;

    @NotBlank
    private String jobTitle;

    private ApplicationStatus status;

    public String getTo() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}