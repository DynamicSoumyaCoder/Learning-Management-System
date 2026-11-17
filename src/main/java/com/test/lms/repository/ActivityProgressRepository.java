package com.test.lms.repository;

import com.test.lms.entity.ActivityProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityProgressRepository extends JpaRepository<ActivityProgress, Long> {

    Optional<ActivityProgress> findByStudentIdAndActivityId(Long studentId, Long activityId);

    List<ActivityProgress> findByStudentIdAndCourseId(Long studentId, Long courseId);

    long countByStudentIdAndCourseIdAndIsCompletedTrue(Long studentId, Long courseId);
}
