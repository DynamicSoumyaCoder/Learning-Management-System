package com.test.lms.dto;

import com.test.lms.entity.EnrollmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Progress tracking record displayed on Instructor Dashboard")
public class StudentProgressDTO {

    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;

    private Long courseId;
    private String courseName;
    private Double courseHours;

    private long totalActivities;
    private long completedActivities;
    private double progressPercentage;

    private EnrollmentStatus enrollmentStatus;
    private LocalDateTime enrolledAt;
}
