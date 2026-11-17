package com.test.lms.service;

import com.test.lms.dto.ActivityRequestDTO;
import com.test.lms.dto.ActivityResponseDTO;
import com.test.lms.dto.CourseRequestDTO;
import com.test.lms.dto.CourseResponseDTO;

import java.util.List;

public interface CourseService {

    CourseResponseDTO createCourse(CourseRequestDTO requestDTO);

    List<CourseResponseDTO> getAllCourses(Long instructorId, String category);

    CourseResponseDTO getCourseById(Long id);

    CourseResponseDTO updateCourse(Long id, CourseRequestDTO requestDTO);

    void deleteCourse(Long id);

    ActivityResponseDTO addActivity(Long courseId, ActivityRequestDTO requestDTO);

    ActivityResponseDTO updateActivity(Long activityId, ActivityRequestDTO requestDTO);

    void deleteActivity(Long activityId);

    List<ActivityResponseDTO> getCourseActivities(Long courseId);
}
