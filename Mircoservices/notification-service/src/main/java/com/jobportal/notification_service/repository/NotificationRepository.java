package com.jobportal.notification_service.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.notification_service.entity.NotificationLog;

public interface NotificationRepository
        extends MongoRepository<
                NotificationLog,
                String
        > {
}