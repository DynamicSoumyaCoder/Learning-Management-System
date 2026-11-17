package com.test.lms.service;

import com.test.lms.dto.CourseLearningDTO;
import com.test.lms.dto.StudentProgressDTO;

import java.util.List;

public interface StudentService {

    List<StudentProgressDTO> getEnrolledCourses(Long studentId);

    CourseLearningDTO getCourseLearningRoom(Long studentId, Long courseId);

    void completeActivity(Long studentId, Long activityId);
}
