package com.test.lms.dto;

import com.test.lms.entity.ActivityType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Payload for creating or updating a Course Activity")
public class ActivityRequestDTO {

    @NotBlank(message = "Activity title is required")
    @Schema(example = "Introduction to Spring Boot & Architecture")
    private String title;

    @Schema(example = "Overview of MVC pattern, entities, repositories, and services.")
    private String description;

    @NotNull(message = "Activity type is required (VIDEO, READING, ASSIGNMENT, QUIZ)")
    @Schema(example = "VIDEO")
    private ActivityType activityType;

    @Positive(message = "Duration must be positive")
    @Schema(example = "30", description = "Estimated duration in minutes")
    private Integer durationMinutes;

    @Schema(example = "1", description = "Sequence order of the activity in the course")
    private Integer orderIndex;

    @Schema(example = "https://www.youtube.com/watch?v=sample or instructions", description = "Link or text instructions")
    private String content;
}
