package com.test.lms.dto;

import com.test.lms.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Authentication response containing user info and role")
public class AuthResponseDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private Boolean isFirstLogin;
    private String phone;
    private String token;
}
