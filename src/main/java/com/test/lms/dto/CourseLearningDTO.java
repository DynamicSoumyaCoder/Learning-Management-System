package com.test.lms.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Detailed course learning room payload for Student")
public class CourseLearningDTO {

    private Long courseId;
    private String courseName;
    private String description;
    private Double hours;
    private String category;
    private String instructorName;

    private long totalActivities;
    private long completedActivities;
    private double progressPercentage;
    private boolean isFullyCompleted;

    private List<ActivityResponseDTO> activities;
}
