package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.dto.request.UpdateProfileRequest;
import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.dto.response.UserProfileDTO;
import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.entity.Meal;
import com.dhruv.arthrix.entity.User;
import com.dhruv.arthrix.entity.Workout;
import com.dhruv.arthrix.enums.Gender;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.mapper.MealMapper;
import com.dhruv.arthrix.mapper.UserMapper;
import com.dhruv.arthrix.mapper.WorkoutMapper;
import com.dhruv.arthrix.repository.MealRepository;
import com.dhruv.arthrix.repository.UserRepository;
import com.dhruv.arthrix.repository.WorkoutRepository;
import com.dhruv.arthrix.service.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LogManager.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final MealRepository mealRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, WorkoutRepository workoutRepository, MealRepository mealRepository) {
        this.userRepository = userRepository;
        this.workoutRepository = workoutRepository;
        this.mealRepository = mealRepository;
    }

    @Override
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("getUserProfile failed — user not found, userId={}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });
        return UserMapper.toDTO(user);
    }

    @Override
    public UserProfileDTO updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("updateUserProfile failed — user not found, userId={}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setHeight(request.getHeight());
        user.setWeight(request.getWeight());
        user.setDietPreference(request.getDietPreference());
        user.setFitnessGoal(request.getFitnessGoal());

        User updatedUser = userRepository.save(user);
        logger.info("Profile updated for userId={}", userId);
        return UserMapper.toDTO(updatedUser);
    }

    @Override
    public double calculateBmi(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("calculateBmi failed — user not found, userId={}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        double heightInMeters = user.getHeight() / 100;
        double bmi = user.getWeight() / (heightInMeters * heightInMeters);
        logger.debug("Calculated BMI={} for userId={}", bmi, userId);
        return bmi;
    }

    @Override
    public double calculateDailyCalories(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("calculateDailyCalories failed — user not found, userId={}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        double bmr;
        if (user.getGender() == Gender.MALE) {
            bmr = (10 * user.getWeight()) + (6.25 * user.getHeight()) - (5 * user.getAge()) + 5;
        } else {
            bmr = (10 * user.getWeight()) + (6.25 * user.getHeight()) - (5 * user.getAge()) - 161;
        }

        double dailyCalories = bmr * 1.2;
        logger.debug("Calculated daily calories={} for userId={}", dailyCalories, userId);
        return dailyCalories;
    }

    @Override
    public double calculateProteinNeeds(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("calculateProteinNeeds failed — user not found, userId={}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        return user.getWeight() * 1.6;
    }

    @Override
    public void addFavoriteWorkout(Long userId, Long workoutId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + workoutId));

        user.getFavoriteWorkouts().add(workout);
        userRepository.save(user);
        logger.info("userId={} favorited workoutId={}", userId, workoutId);
    }

    @Override
    public void removeFavoriteWorkout(Long userId, Long workoutId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + workoutId));

        user.getFavoriteWorkouts().remove(workout);
        userRepository.save(user);
        logger.info("userId={} unfavorited workoutId={}", userId, workoutId);
    }

    @Override
    public List<WorkoutDTO> getFavoriteWorkouts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return user.getFavoriteWorkouts().stream()
                .map(WorkoutMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void addFavoriteMeal(Long userId, Long mealId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + mealId));

        user.getFavoriteMeals().add(meal);
        userRepository.save(user);
        logger.info("userId={} favorited mealId={}", userId, mealId);
    }

    @Override
    public void removeFavoriteMeal(Long userId, Long mealId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + mealId));

        user.getFavoriteMeals().remove(meal);
        userRepository.save(user);
        logger.info("userId={} unfavorited mealId={}", userId, mealId);
    }

    @Override
    public List<MealDTO> getFavoriteMeals(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return user.getFavoriteMeals().stream()
                .map(MealMapper::toDTO)
                .collect(Collectors.toList());
    }
}