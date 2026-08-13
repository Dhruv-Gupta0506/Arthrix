package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.dto.response.AnalyticsSummaryDTO;
import com.dhruv.arthrix.dto.response.DailyChallengeDTO;
import com.dhruv.arthrix.dto.response.DashboardDTO;
import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.entity.Meal;
import com.dhruv.arthrix.entity.User;
import com.dhruv.arthrix.entity.UserDailyChallenge;
import com.dhruv.arthrix.entity.Workout;
import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.MealType;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.mapper.MealMapper;
import com.dhruv.arthrix.mapper.WorkoutMapper;
import com.dhruv.arthrix.repository.MealRepository;
import com.dhruv.arthrix.repository.UserDailyChallengeRepository;
import com.dhruv.arthrix.repository.UserRepository;
import com.dhruv.arthrix.repository.WorkoutRepository;
import com.dhruv.arthrix.service.ChallengeService;
import com.dhruv.arthrix.service.DashboardService;
import com.dhruv.arthrix.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final MealRepository mealRepository;
    private final UserDailyChallengeRepository userDailyChallengeRepository;
    private final ChallengeService challengeService;
    private final UserService userService;


    @Autowired
    public DashboardServiceImpl(UserRepository userRepository,
                                WorkoutRepository workoutRepository,
                                MealRepository mealRepository,
                                UserDailyChallengeRepository userDailyChallengeRepository,
                                ChallengeService challengeService,
                                UserService userService) {
        this.userRepository = userRepository;
        this.workoutRepository = workoutRepository;
        this.mealRepository = mealRepository;
        this.userDailyChallengeRepository = userDailyChallengeRepository;
        this.challengeService = challengeService;
        this.userService = userService;
    }

    @Override
    public DashboardDTO getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));


        List<DailyChallengeDTO> todayChallenges = challengeService.getTodayChallenges(userId);
        long completedCount = todayChallenges.stream()
                .filter(DailyChallengeDTO::isCompleted)
                .count();

        DashboardDTO dto = new DashboardDTO();
        dto.setUserName(user.getName());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setFitnessGoal(user.getFitnessGoal());
        dto.setCurrentStreak(user.getCurrentStreak());
        dto.setTodayChallenges(todayChallenges);
        dto.setChallengesCompletedToday((int) completedCount);
        dto.setChallengesTotalToday(todayChallenges.size());


        if (user.getHeight() != null && user.getWeight() != null) {
            dto.setBmi(userService.calculateBmi(userId));
        }
        if (user.getAge() != null && user.getGender() != null
                && user.getHeight() != null && user.getWeight() != null) {
            dto.setDailyCalorieGoal(userService.calculateDailyCalories(userId));
            dto.setDailyProteinGoal(userService.calculateProteinNeeds(userId));
        }

        dto.setRecommendedWorkout(pickRecommendedWorkout(user));
        dto.setRecommendedMeal(pickRecommendedMeal(user));

        return dto;
    }

    @Override
    public AnalyticsSummaryDTO getWeeklyAnalytics(Long userId) {

        return buildAnalytics(userId, 6);
    }

    @Override
    public AnalyticsSummaryDTO getMonthlyAnalytics(Long userId) {

        return buildAnalytics(userId, 29);
    }

    private AnalyticsSummaryDTO buildAnalytics(Long userId, int daysBack) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(daysBack);

        List<UserDailyChallenge> records = userDailyChallengeRepository
                .findByUserIdAndAssignedDateBetween(userId, startDate, endDate);

        int totalAssigned = records.size();
        long totalCompleted = records.stream()
                .filter(UserDailyChallenge::isCompleted)
                .count();
        double completionRate = totalAssigned == 0 ? 0.0 : (totalCompleted * 100.0) / totalAssigned;


        long activeDays = records.stream()
                .filter(UserDailyChallenge::isCompleted)
                .map(UserDailyChallenge::getAssignedDate)
                .distinct()
                .count();


        double avgWorkoutCalories = 300.0;
        if (user.getFitnessGoal() != null) {
            List<Workout> matchingWorkouts = workoutRepository
                    .findByFitnessGoalAndDifficulty(user.getFitnessGoal(), Difficulty.BEGINNER);
            if (!matchingWorkouts.isEmpty()) {
                avgWorkoutCalories = matchingWorkouts.stream()
                        .filter(w -> w.getEstimatedCaloriesBurned() != null)
                        .mapToInt(Workout::getEstimatedCaloriesBurned)
                        .average()
                        .orElse(300.0);
            }
        }
        double estimatedCaloriesBurned = activeDays * avgWorkoutCalories;


        long daysInPeriod = daysBack + 1L;
        double dailyCalorieGoal = 0.0;
        if (user.getAge() != null && user.getGender() != null
                && user.getHeight() != null && user.getWeight() != null) {
            dailyCalorieGoal = userService.calculateDailyCalories(userId);
        }
        double estimatedCaloriesConsumedTarget = daysInPeriod * dailyCalorieGoal;

        AnalyticsSummaryDTO dto = new AnalyticsSummaryDTO();
        dto.setStartDate(startDate);
        dto.setEndDate(endDate);
        dto.setTotalChallengesAssigned(totalAssigned);
        dto.setTotalChallengesCompleted((int) totalCompleted);

        dto.setCompletionRatePercent(Math.round(completionRate * 10.0) / 10.0);
        dto.setEstimatedCaloriesBurned(estimatedCaloriesBurned);
        dto.setEstimatedCaloriesConsumedTarget(estimatedCaloriesConsumedTarget);

        return dto;
    }

    private WorkoutDTO pickRecommendedWorkout(User user) {
        if (user.getFitnessGoal() == null) {
            return null;
        }
        List<Workout> candidates = workoutRepository
                .findByFitnessGoalAndDifficulty(user.getFitnessGoal(), Difficulty.BEGINNER);
        if (candidates.isEmpty()) {
            return null;
        }

        int index = (int) (LocalDate.now().toEpochDay() % candidates.size());
        return WorkoutMapper.toDTO(candidates.get(index));
    }

    private MealDTO pickRecommendedMeal(User user) {
        if (user.getDietPreference() == null) {
            return null;
        }
        List<Meal> candidates = mealRepository
                .findByDietPreferenceAndMealType(user.getDietPreference(), MealType.LUNCH);
        if (candidates.isEmpty()) {
            return null;
        }
        int index = (int) (LocalDate.now().toEpochDay() % candidates.size());
        return MealMapper.toDTO(candidates.get(index));
    }
}