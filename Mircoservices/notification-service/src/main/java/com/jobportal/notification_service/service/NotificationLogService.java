package com.jobportal.notification_service.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.jobportal.notification_service.entity.NotificationLog;
import com.jobportal.notification_service.enums.NotificationState;
import com.jobportal.notification_service.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationLogService {

    private final NotificationRepository repository;

    public void saveLog(
            String recipient,
            String subject,
            String message,
            String type,
            NotificationState state
    ) {

        NotificationLog log =
                new NotificationLog();

        log.setRecipient(recipient);

        log.setSubject(subject);

        log.setMessage(message);

        log.setType(type);

        log.setState(state);

        log.setCreatedAt(
                LocalDateTime.now()
        );

        repository.save(log);
    }
}