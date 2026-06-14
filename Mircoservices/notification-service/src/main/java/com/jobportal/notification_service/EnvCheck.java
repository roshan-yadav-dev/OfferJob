package com.jobportal.notification_service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class EnvCheck {

    @Value("${MONGODB_URI:NOT_FOUND}")
    private String mongoUri;

    @Value("${MAIL_HOST:NOT_FOUND}")
    private String mailHost;

    @Value("${MAIL_PORT:NOT_FOUND}")
    private String mailPort;

    @Value("${MAIL_USERNAME:NOT_FOUND}")
    private String mailUsername;

    @PostConstruct
    public void printEnv() {

        System.out.println(
                "MONGODB_URI PRESENT = " +
                (!mongoUri.equals("NOT_FOUND"))
        );

        if (!mongoUri.equals("NOT_FOUND")) {
            System.out.println(
                    "MONGODB_URI PREFIX = " +
                    mongoUri.substring(
                            0,
                            Math.min(25, mongoUri.length())
                    )
            );
        }
    }

    @PostConstruct
    public void printMailConfig() {

        System.out.println("MAIL_HOST = " + mailHost);
        System.out.println("MAIL_PORT = " + mailPort);

        if (!mailUsername.equals("NOT_FOUND")) {
            System.out.println("MAIL_USERNAME PRESENT = true");
        } else {
            System.out.println("MAIL_USERNAME PRESENT = false");
        }
    }
}