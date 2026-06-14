package com.jobportal.notification_service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class EnvCheck {

    @Value("${MONGODB_URI:NOT_FOUND}")
    private String mongoUri;

    @PostConstruct
    public void printEnv() {
        System.out.println(
            "MONGODB_URI PRESENT = " +
            (!mongoUri.equals("NOT_FOUND"))
        );
    }
}