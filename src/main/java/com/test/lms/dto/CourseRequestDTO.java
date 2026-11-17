package com.test.lms.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request payload for creating/updating a Course")
public class CourseRequestDTO {

    @NotBlank(message = "Course name is required")
    @Size(min = 2, max = 150, message = "Course name must be between 2 and 150 characters")
    @Schema(example = "Full Stack Java Development")
    private String name;

    @NotNull(message = "Course hours is required")
    @Positive(message = "Course hours must be greater than zero")
    @Schema(example = "45.0", description = "Estimated duration in hours")
    private Double hours;

    @Schema(example = "Complete bootcamp covering Spring Boot, MySQL, and React.")
    private String description;

    @Schema(example = "Software Engineering")
    private String category;

    @Schema(description = "ID of the instructor creating this course (optional if taken from token)")
    private Long instructorId;
}
