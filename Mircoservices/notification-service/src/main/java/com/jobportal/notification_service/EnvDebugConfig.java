/*
package com.jobportal.notification_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NotificationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotificationServiceApplication.class, args);
	}

}*/

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvDebugConfig {

    @Bean
    CommandLineRunner debugEnv() {
        return args -> {
            System.out.println(
                "MONGODB_URI=" + System.getenv("MONGODB_URI")
            );
        };
    }
}