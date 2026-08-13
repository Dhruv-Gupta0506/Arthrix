package com.dhruv.arthrix.controller;

import com.dhruv.arthrix.dto.request.UpdateProfileRequest;
import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.dto.response.UserProfileDTO;
import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.response.ApiResponse;
import com.dhruv.arthrix.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getUserProfile(@PathVariable Long userId) {
        UserProfileDTO profile = userService.getUserProfile(userId);
        ApiResponse<UserProfileDTO> response = ApiResponse.success("User profile fetched successfully", profile);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody UpdateProfileRequest request) {

        UserProfileDTO updatedProfile = userService.updateUserProfile(userId, request);
        ApiResponse<UserProfileDTO> response = ApiResponse.success("Profile updated successfully", updatedProfile);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}/bmi")
    public ResponseEntity<ApiResponse<Double>> getBmi(@PathVariable Long userId) {
        double bmi = userService.calculateBmi(userId);
        ApiResponse<Double> response = ApiResponse.success("BMI calculated successfully", bmi);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}/daily-calories")
    public ResponseEntity<ApiResponse<Double>> getDailyCalories(@PathVariable Long userId) {
        double calories = userService.calculateDailyCalories(userId);
        ApiResponse<Double> response = ApiResponse.success("Daily calorie needs calculated successfully", calories);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}/protein-needs")
    public ResponseEntity<ApiResponse<Double>> getProteinNeeds(@PathVariable Long userId) {
        double protein = userService.calculateProteinNeeds(userId);
        ApiResponse<Double> response = ApiResponse.success("Protein needs calculated successfully", protein);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{userId}/favorites/workouts/{workoutId}")
    public ResponseEntity<ApiResponse<Void>> addFavoriteWorkout(@PathVariable Long userId, @PathVariable Long workoutId) {
        userService.addFavoriteWorkout(userId, workoutId);
        ApiResponse<Void> response = ApiResponse.success("Workout added to favorites", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/favorites/workouts/{workoutId}")
    public ResponseEntity<ApiResponse<Void>> removeFavoriteWorkout(@PathVariable Long userId, @PathVariable Long workoutId) {
        userService.removeFavoriteWorkout(userId, workoutId);
        ApiResponse<Void> response = ApiResponse.success("Workout removed from favorites", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}/favorites/workouts")
    public ResponseEntity<ApiResponse<List<WorkoutDTO>>> getFavoriteWorkouts(@PathVariable Long userId) {
        List<WorkoutDTO> favorites = userService.getFavoriteWorkouts(userId);
        ApiResponse<List<WorkoutDTO>> response = ApiResponse.success("Favorite workouts fetched successfully", favorites);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{userId}/favorites/meals/{mealId}")
    public ResponseEntity<ApiResponse<Void>> addFavoriteMeal(@PathVariable Long userId, @PathVariable Long mealId) {
        userService.addFavoriteMeal(userId, mealId);
        ApiResponse<Void> response = ApiResponse.success("Meal added to favorites", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/favorites/meals/{mealId}")
    public ResponseEntity<ApiResponse<Void>> removeFavoriteMeal(@PathVariable Long userId, @PathVariable Long mealId) {
        userService.removeFavoriteMeal(userId, mealId);
        ApiResponse<Void> response = ApiResponse.success("Meal removed from favorites", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}/favorites/meals")
    public ResponseEntity<ApiResponse<List<MealDTO>>> getFavoriteMeals(@PathVariable Long userId) {
        List<MealDTO> favorites = userService.getFavoriteMeals(userId);
        ApiResponse<List<MealDTO>> response = ApiResponse.success("Favorite meals fetched successfully", favorites);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}