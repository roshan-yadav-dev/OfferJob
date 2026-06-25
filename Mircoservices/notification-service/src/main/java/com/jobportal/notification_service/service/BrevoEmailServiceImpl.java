package com.jobportal.notification_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class BrevoEmailServiceImpl
        implements BrevoEmailService {

    @Value("${brevo.api.key:}")
    private String apiKey;

    @Value("${mail.from:}")
    private String mailFrom;

    private final OkHttpClient client =
            new OkHttpClient();

    @PostConstruct
public void checkBrevo() {

    System.out.println(
        "API KEY PRESENT = " +
        (apiKey != null && !apiKey.isBlank())
    );

    if (apiKey != null && !apiKey.isBlank()) {
        System.out.println(
            "API KEY PREFIX = " +
            apiKey.substring(0, Math.min(5, apiKey.length()))
        );
    }

    System.out.println(
        "MAIL_FROM PRESENT = " +
        (mailFrom != null && !mailFrom.isBlank())
    );
}

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }

    private String extractSenderEmail() {
        if (mailFrom == null) {
            return "";
        }

        String trimmed = mailFrom.trim();
        int start = trimmed.indexOf('<');
        int end = trimmed.indexOf('>');

        if (start >= 0 && end > start) {
            return trimmed.substring(start + 1, end).trim();
        }

        return trimmed;
    }

    private String extractSenderName() {
        if (mailFrom == null) {
            return "";
        }

        String trimmed = mailFrom.trim();
        int start = trimmed.indexOf('<');

        if (start > 0) {
            return trimmed.substring(0, start)
                    .replace("\"", "")
                    .trim();
        }

        return "";
    }

    private String buildSenderJson() {
        String senderEmail = extractSenderEmail();
        String senderName = extractSenderName();

        if (senderName.isBlank()) {
            return """
                    {
                      "email":"%s"
                    }
                    """
                    .formatted(escapeJson(senderEmail));
        }

        return """
                {
                  "email":"%s",
                  "name":"%s"
                }
                """
                .formatted(
                        escapeJson(senderEmail),
                        escapeJson(senderName)
                );
    }

    @Override
    public void sendEmail(
            String to,
            String subject,
            String html
    ) {
        String senderEmail = extractSenderEmail();

        if (apiKey == null || apiKey.isBlank() || senderEmail.isBlank()) {
            throw new RuntimeException("Brevo API is not configured");
        }

        String json =
                """
                {
                  "sender":%s,
                  "to":[{"email":"%s"}],
                  "subject":"%s",
                  "htmlContent":"%s"
                }
                """
                .formatted(
                        buildSenderJson(),
                        escapeJson(to),
                        escapeJson(subject),
                        escapeJson(html)
                );

        RequestBody body =
                RequestBody.create(
                        json,
                        MediaType.parse("application/json")
                );

        Request request =
                new Request.Builder()
                        .url("https://api.brevo.com/v3/smtp/email")
                        .addHeader(
                                "api-key",
                                apiKey
                        )
                        .addHeader(
                                "Content-Type",
                                "application/json"
                        )
                        .post(body)
                        .build();

        try (Response response =
                     client.newCall(request).execute()) {

            if (!response.isSuccessful()) {

                String errorBody =
                        response.body() != null
                                ? response.body().string()
                                : "No response body";

                throw new RuntimeException(
                        "Brevo API Error: " + errorBody
                );
            }

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Brevo email failed",
                    ex
            );
        }
    }
}
