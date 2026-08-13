package com.dhruv.arthrix.repository;

import com.dhruv.arthrix.entity.UserDailyChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface UserDailyChallengeRepository extends JpaRepository<UserDailyChallenge, Long> {

    List<UserDailyChallenge> findByUserIdAndAssignedDate(Long userId, LocalDate assignedDate);

    List<UserDailyChallenge> findByUserIdAndAssignedDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}