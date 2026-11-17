package com.test.lms.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Student profile response")
public class StudentResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String bio;
    private Boolean isFirstLogin;
    private LocalDateTime createdAt;
}
