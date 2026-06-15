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
public class ResendEmailServiceImpl
        implements ResendEmailService {

    @Value("${resend.api.key:}")
    private String apiKey;

    private final OkHttpClient client =
            new OkHttpClient();

    @PostConstruct
public void checkResend() {

    System.out.println(
        "API KEY PRESENT = " +
        (apiKey != null && !apiKey.isBlank())
    );

    if (apiKey != null && !apiKey.isBlank()) {
        System.out.println(
            "API KEY PREFIX = " +
            apiKey.substring(0, 5)
        );
    }
}


    @Override
    public void sendEmail(
            String to,
            String subject,
            String html
    ) {

        String json =
                """
                {
                  "from":"OfferJob <onboarding@resend.dev>",
                  "to":["%s"],
                  "subject":"%s",
                  "html":"%s"
                }
                """
                .formatted(
                        to,
                        subject,
                        html.replace("\"", "\\\"")
                );

        RequestBody body =
                RequestBody.create(
                        json,
                        MediaType.parse("application/json")
                );

        Request request =
                new Request.Builder()
                        .url("https://api.resend.com/emails")
                        .addHeader(
                                "Authorization",
                                "Bearer " + apiKey
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
                        "Resend API Error: " + errorBody
                );
            }

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Resend email failed",
                    ex
            );
        }
    }
}