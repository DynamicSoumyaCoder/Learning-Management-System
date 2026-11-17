package com.test.lms.service;

import com.test.lms.dto.AuthRequestDTO;
import com.test.lms.dto.AuthResponseDTO;
import com.test.lms.dto.ChangePasswordDTO;
import com.test.lms.dto.RegisterInstructorDTO;

public interface AuthService {

    AuthResponseDTO login(AuthRequestDTO requestDTO);

    AuthResponseDTO registerInstructor(RegisterInstructorDTO requestDTO);

    void changePassword(ChangePasswordDTO requestDTO);
}
