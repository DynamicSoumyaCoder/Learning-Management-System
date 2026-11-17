package com.test.lms.dto;

import com.test.lms.entity.ActivityType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Activity details returned to Instructor or Student")
public class ActivityResponseDTO {

    private Long id;
    private Long courseId;
    private String courseName;
    private String title;
    private String description;
    private ActivityType activityType;
    private Integer durationMinutes;
    private Integer orderIndex;
    private String content;
    private Boolean isCompleted; // relevant when fetched for student
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
}
