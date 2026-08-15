package com.dhruv.arthrix.controller;

import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.dto.response.MealPlanDTO;
import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.MealType;
import com.dhruv.arthrix.response.ApiResponse;
import com.dhruv.arthrix.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private final MealService mealService;

    @Autowired
    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MealDTO>>> getAllMeals() {
        List<MealDTO> meals = mealService.getAllMeals();
        ApiResponse<List<MealDTO>> response = ApiResponse.success("Meals fetched successfully", meals);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{mealId}")
    public ResponseEntity<ApiResponse<MealDTO>> getMealById(@PathVariable Long mealId) {
        MealDTO meal = mealService.getMealById(mealId);
        ApiResponse<MealDTO> response = ApiResponse.success("Meal fetched successfully", meal);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<MealDTO>>> getMealsByDietPreferenceAndMealType(
            @RequestParam(required = false) DietPreference dietPreference,
            @RequestParam(required = false) MealType mealType) {

        List<MealDTO> meals = mealService.getMealsByDietPreferenceAndMealType(dietPreference, mealType);
        ApiResponse<List<MealDTO>> response = ApiResponse.success("Filtered meals fetched successfully", meals);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/plan")
    public ResponseEntity<ApiResponse<MealPlanDTO>> generateMealPlan(
            @RequestParam(required = false) DietPreference dietPreference,
            @RequestParam(required = false) FitnessGoal goal) {

        MealPlanDTO plan = mealService.generateMealPlan(dietPreference, goal);
        ApiResponse<MealPlanDTO> response = ApiResponse.success("Meal plan generated successfully", plan);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}