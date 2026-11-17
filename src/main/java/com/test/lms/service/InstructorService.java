package com.test.lms.service;

import com.test.lms.dto.EnrollmentRequestDTO;
import com.test.lms.dto.StudentCreateDTO;
import com.test.lms.dto.StudentProgressDTO;
import com.test.lms.dto.StudentResponseDTO;

import java.util.List;

public interface InstructorService {

    StudentResponseDTO addStudent(StudentCreateDTO requestDTO);

    List<StudentResponseDTO> getAllStudents();

    void enrollStudent(EnrollmentRequestDTO requestDTO);

    void unenrollStudent(Long studentId, Long courseId);

    List<StudentProgressDTO> getInstructorDashboardProgress(Long instructorId);
}
