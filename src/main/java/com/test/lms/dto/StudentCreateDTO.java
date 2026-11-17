package com.test.lms.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Payload used by Instructor to register a new Student")
public class StudentCreateDTO {

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(example = "John Doe")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(example = "john.doe@student.com")
    private String email;

    @NotBlank(message = "Default password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Schema(example = "tempPass123", description = "Temporary password given by instructor for student's first login")
    private String defaultPassword;

    @Schema(example = "+919876543210", description = "Student contact phone number")
    private String phone;

    @Schema(example = "Enrolled in Batch A, Computer Science", description = "Optional bio or notes")
    private String bio;
}
