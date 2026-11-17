package com.test.lms.service.impl;

import com.test.lms.dto.AuthRequestDTO;
import com.test.lms.dto.AuthResponseDTO;
import com.test.lms.dto.ChangePasswordDTO;
import com.test.lms.dto.RegisterInstructorDTO;
import com.test.lms.entity.Role;
import com.test.lms.entity.User;
import com.test.lms.exception.DuplicateResourceException;
import com.test.lms.exception.ResourceNotFoundException;
import com.test.lms.repository.UserRepository;
import com.test.lms.service.AuthService;
import com.test.lms.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDTO login(AuthRequestDTO requestDTO) {
        User user = userRepository.findByEmail(requestDTO.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!PasswordUtil.verifyPassword(requestDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate simple bearer token for session identity
        String token = "Bearer-" + UUID.randomUUID() + "-" + user.getId();

        return AuthResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isFirstLogin(user.getIsFirstLogin())
                .phone(user.getPhone())
                .token(token)
                .build();
    }

    @Override
    @Transactional
    public AuthResponseDTO registerInstructor(RegisterInstructorDTO requestDTO) {
        String email = requestDTO.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email '" + email + "' already exists");
        }

        User instructor = User.builder()
                .name(requestDTO.getName().trim())
                .email(email)
                .password(PasswordUtil.hashPassword(requestDTO.getPassword()))
                .phone(requestDTO.getPhone() != null ? requestDTO.getPhone().trim() : null)
                .bio(requestDTO.getBio() != null ? requestDTO.getBio().trim() : null)
                .role(Role.INSTRUCTOR)
                .isFirstLogin(false) // Instructor registers directly with their chosen password
                .build();

        User saved = userRepository.save(instructor);

        String token = "Bearer-" + UUID.randomUUID() + "-" + saved.getId();
        return AuthResponseDTO.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .isFirstLogin(false)
                .phone(saved.getPhone())
                .token(token)
                .build();
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordDTO requestDTO) {
        String email = requestDTO.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!PasswordUtil.verifyPassword(requestDTO.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current temporary password does not match");
        }

        if (requestDTO.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }

        user.setPassword(PasswordUtil.hashPassword(requestDTO.getNewPassword()));
        user.setIsFirstLogin(false); // First login change password completed!
        userRepository.save(user);
    }
}
