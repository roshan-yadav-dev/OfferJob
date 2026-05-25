package com.jobportal.notification_service.exception;

public class EmailSendingException
        extends RuntimeException {

    public EmailSendingException(
            String message
    ) {
        super(message);
    }
}