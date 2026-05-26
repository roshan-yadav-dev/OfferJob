package com.jobportal.notification_service.exception;

import com.jobportal.notification_service.dto.ApiResponse;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            EmailSendingException.class
    )
    public ApiResponse handleEmailException(
            EmailSendingException ex
    ) {

        return new ApiResponse(
                false,
                ex.getMessage()
        );
    }
}