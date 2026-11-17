package com.test.lms.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response representation of a Course")
public class CourseResponseDTO {

    private Long id;
    private String name;
    private Double hours;
    private String description;
    private String category;
    private Long instructorId;
    private String instructorName;
    private Integer activityCount;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
