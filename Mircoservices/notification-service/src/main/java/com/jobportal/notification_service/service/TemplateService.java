package com.jobportal.notification_service.service;

import com.jobportal.notification_service.dto.ApplicationStatusRequest;
import com.jobportal.notification_service.enums.ApplicationStatus;

import org.springframework.stereotype.Service;

@Service
public class TemplateService {

    public String buildApplicationStatusTemplate(
            ApplicationStatusRequest request
    ) {

        if (request.getStatus()
                == ApplicationStatus.SHORTLISTED) {

            return """
                    Congratulations %s,

                    You have been shortlisted for the position of %s.

                    Our team will contact you soon.

                    Smart AI Job Portal
                    """
                    .formatted(
                            request.getStudentName(),
                            request.getJobTitle()
                    );
        }

        if (request.getStatus()
                == ApplicationStatus.REJECTED) {

            return """
                    Hello %s,

                    Thank you for applying for %s.

                    Unfortunately, you were not selected this time.

                    We encourage you to apply again.

                    Smart AI Job Portal
                    """
                    .formatted(
                            request.getStudentName(),
                            request.getJobTitle()
                    );
        }

        return """
                Application status updated.
                """;
    }
}