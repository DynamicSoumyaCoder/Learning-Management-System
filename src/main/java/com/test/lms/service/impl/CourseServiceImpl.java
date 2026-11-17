package com.test.lms.service.impl;

import com.test.lms.dto.ActivityRequestDTO;
import com.test.lms.dto.ActivityResponseDTO;
import com.test.lms.dto.CourseRequestDTO;
import com.test.lms.dto.CourseResponseDTO;
import com.test.lms.entity.Activity;
import com.test.lms.entity.Course;
import com.test.lms.entity.User;
import com.test.lms.exception.DuplicateResourceException;
import com.test.lms.exception.ResourceNotFoundException;
import com.test.lms.repository.ActivityRepository;
import com.test.lms.repository.CourseRepository;
import com.test.lms.repository.UserRepository;
import com.test.lms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CourseResponseDTO createCourse(CourseRequestDTO requestDTO) {
        String courseName = requestDTO.getName().trim();
        if (courseRepository.existsByNameIgnoreCase(courseName)) {
            throw new DuplicateResourceException("Course with name '" + courseName + "' already exists");
        }

        User instructor = null;
        String instructorName = "Main Instructor";
        if (requestDTO.getInstructorId() != null) {
            instructor = userRepository.findById(requestDTO.getInstructorId())
                    .orElse(null);
            if (instructor != null) {
                instructorName = instructor.getName();
            }
        }

        Course course = Course.builder()
                .name(courseName)
                .hours(requestDTO.getHours())
                .description(requestDTO.getDescription() != null ? requestDTO.getDescription().trim() : "")
                .category(requestDTO.getCategory() != null ? requestDTO.getCategory().trim() : "General")
                .instructor(instructor)
                .instructorName(instructorName)
                .active(true)
                .build();

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getAllCourses(Long instructorId, String category) {
        List<Course> courses;
        if (instructorId != null) {
            courses = courseRepository.findByInstructorId(instructorId);
        } else if (category != null && !category.isBlank()) {
            courses = courseRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            courses = courseRepository.findAll();
        }

        return courses.stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponseDTO getCourseById(Long id) {
        Course course = findCourseOrThrow(id);
        return mapToCourseResponse(course);
    }

    @Override
    @Transactional
    public CourseResponseDTO updateCourse(Long id, CourseRequestDTO requestDTO) {
        Course existing = findCourseOrThrow(id);
        String newName = requestDTO.getName().trim();

        if (!existing.getName().equalsIgnoreCase(newName) && courseRepository.existsByNameIgnoreCase(newName)) {
            throw new DuplicateResourceException("Another course with name '" + newName + "' already exists");
        }

        existing.setName(newName);
        existing.setHours(requestDTO.getHours());
        existing.setDescription(requestDTO.getDescription());
        existing.setCategory(requestDTO.getCategory());

        Course updated = courseRepository.save(existing);
        return mapToCourseResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        Course course = findCourseOrThrow(id);
        courseRepository.delete(course);
    }

    @Override
    @Transactional
    public ActivityResponseDTO addActivity(Long courseId, ActivityRequestDTO requestDTO) {
        Course course = findCourseOrThrow(courseId);

        int order = requestDTO.getOrderIndex() != null ? requestDTO.getOrderIndex() :
                (int) activityRepository.countByCourseId(courseId) + 1;

        Activity activity = Activity.builder()
                .course(course)
                .title(requestDTO.getTitle().trim())
                .description(requestDTO.getDescription())
                .activityType(requestDTO.getActivityType())
                .durationMinutes(requestDTO.getDurationMinutes())
                .orderIndex(order)
                .content(requestDTO.getContent())
                .build();

        Activity saved = activityRepository.save(activity);
        return mapToActivityResponse(saved, null);
    }

    @Override
    @Transactional
    public ActivityResponseDTO updateActivity(Long activityId, ActivityRequestDTO requestDTO) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        activity.setTitle(requestDTO.getTitle().trim());
        activity.setDescription(requestDTO.getDescription());
        activity.setActivityType(requestDTO.getActivityType());
        activity.setDurationMinutes(requestDTO.getDurationMinutes());
        if (requestDTO.getOrderIndex() != null) {
            activity.setOrderIndex(requestDTO.getOrderIndex());
        }
        activity.setContent(requestDTO.getContent());

        Activity updated = activityRepository.save(activity);
        return mapToActivityResponse(updated, null);
    }

    @Override
    @Transactional
    public void deleteActivity(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));
        activityRepository.delete(activity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityResponseDTO> getCourseActivities(Long courseId) {
        findCourseOrThrow(courseId);
        return activityRepository.findByCourseIdOrderByOrderIndexAsc(courseId).stream()
                .map(a -> mapToActivityResponse(a, null))
                .collect(Collectors.toList());
    }

    private Course findCourseOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    private CourseResponseDTO mapToCourseResponse(Course course) {
        int activityCount = (int) activityRepository.countByCourseId(course.getId());
        return CourseResponseDTO.builder()
                .id(course.getId())
                .name(course.getName())
                .hours(course.getHours())
                .description(course.getDescription())
                .category(course.getCategory())
                .instructorId(course.getInstructor() != null ? course.getInstructor().getId() : null)
                .instructorName(course.getInstructorName())
                .activityCount(activityCount)
                .active(course.getActive())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }

    private ActivityResponseDTO mapToActivityResponse(Activity activity, Boolean isCompleted) {
        return ActivityResponseDTO.builder()
                .id(activity.getId())
                .courseId(activity.getCourse().getId())
                .courseName(activity.getCourse().getName())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .activityType(activity.getActivityType())
                .durationMinutes(activity.getDurationMinutes())
                .orderIndex(activity.getOrderIndex())
                .content(activity.getContent())
                .isCompleted(isCompleted)
                .createdAt(activity.getCreatedAt())
                .build();
    }
}
