package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.dto.response.DailyChallengeDTO;
import com.dhruv.arthrix.entity.DailyChallenge;
import com.dhruv.arthrix.entity.User;
import com.dhruv.arthrix.entity.UserDailyChallenge;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.mapper.ChallengeMapper;
import com.dhruv.arthrix.repository.DailyChallengeRepository;
import com.dhruv.arthrix.repository.UserDailyChallengeRepository;
import com.dhruv.arthrix.repository.UserRepository;
import com.dhruv.arthrix.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChallengeServiceImpl implements ChallengeService {

    private final DailyChallengeRepository dailyChallengeRepository;
    private final UserDailyChallengeRepository userDailyChallengeRepository;
    private final UserRepository userRepository;

    @Autowired
    public ChallengeServiceImpl(DailyChallengeRepository dailyChallengeRepository,
                                UserDailyChallengeRepository userDailyChallengeRepository,
                                UserRepository userRepository) {
        this.dailyChallengeRepository = dailyChallengeRepository;
        this.userDailyChallengeRepository = userDailyChallengeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<DailyChallengeDTO> getTodayChallenges(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        LocalDate today = LocalDate.now();

        List<UserDailyChallenge> existing = userDailyChallengeRepository
                .findByUserIdAndAssignedDate(userId, today);

        if (!existing.isEmpty()) {
            return existing.stream()
                    .map(ChallengeMapper::toDTO)
                    .collect(Collectors.toList());
        }

        List<DailyChallenge> pool = dailyChallengeRepository.findAll();
        Collections.shuffle(pool);

        List<DailyChallenge> selected = pool.stream()
                .limit(5)
                .collect(Collectors.toList());

        List<UserDailyChallenge> assigned = selected.stream()
                .map(challenge -> {
                    UserDailyChallenge udc = new UserDailyChallenge();
                    udc.setUser(user);
                    udc.setDailyChallenge(challenge);
                    udc.setAssignedDate(today);
                    udc.setCompleted(false);
                    return userDailyChallengeRepository.save(udc);
                })
                .collect(Collectors.toList());

        return assigned.stream()
                .map(ChallengeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void completeChallenge(Long userChallengeId) {
        UserDailyChallenge userDailyChallenge = userDailyChallengeRepository.findById(userChallengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Assigned challenge not found with id: " + userChallengeId));

        userDailyChallenge.setCompleted(true);
        userDailyChallengeRepository.save(userDailyChallenge);

        User user = userDailyChallenge.getUser();
        LocalDate today = userDailyChallenge.getAssignedDate();

        List<UserDailyChallenge> todaysChallenges = userDailyChallengeRepository
                .findByUserIdAndAssignedDate(user.getId(), today);

        boolean allCompleted = todaysChallenges.stream().allMatch(UserDailyChallenge::isCompleted);

        if (allCompleted) {
            updateStreak(user, today);
        }
    }

    private void updateStreak(User user, LocalDate today) {
        LocalDate lastStreakDate = user.getLastStreakDate();

        if (lastStreakDate != null && lastStreakDate.equals(today)) {
            return;
        }

        if (lastStreakDate != null && lastStreakDate.equals(today.minusDays(1))) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        } else {
            user.setCurrentStreak(1);
        }

        user.setLastStreakDate(today);
        userRepository.save(user);
    }

    @Override
    public int getStreak(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return user.getCurrentStreak();
    }
}