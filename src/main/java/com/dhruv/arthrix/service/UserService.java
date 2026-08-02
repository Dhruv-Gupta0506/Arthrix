package com.dhruv.arthrix.service;

import com.dhruv.arthrix.dto.request.UpdateProfileRequest;
import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.dto.response.UserProfileDTO;
import com.dhruv.arthrix.dto.response.WorkoutDTO;

import java.util.List;

public interface UserService {

    UserProfileDTO getUserProfile(Long userId);
    UserProfileDTO updateUserProfile(Long userId, UpdateProfileRequest request);
    double calculateBmi(Long userId);
    double calculateDailyCalories(Long userId);
    double calculateProteinNeeds(Long userId);

    void addFavoriteWorkout(Long userId, Long workoutId);
    void removeFavoriteWorkout(Long userId, Long workoutId);
    List<WorkoutDTO> getFavoriteWorkouts(Long userId);

    void addFavoriteMeal(Long userId, Long mealId);
    void removeFavoriteMeal(Long userId, Long mealId);
    List<MealDTO> getFavoriteMeals(Long userId);
}