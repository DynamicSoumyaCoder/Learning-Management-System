package com.test.lms.repository;

import com.test.lms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    boolean existsByNameIgnoreCase(String name);

    List<Course> findByActiveTrue();

    List<Course> findByInstructorId(Long instructorId);

    List<Course> findByCategoryIgnoreCase(String category);
}
