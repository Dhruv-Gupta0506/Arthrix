package com.dhruv.arthrix.service;

import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.MealType;

import java.util.List;

public interface MealService {

    List<MealDTO> getAllMeals();

    MealDTO getMealById(Long mealId);

    List<MealDTO> getMealsByDietPreferenceAndMealType(DietPreference dietPreference , MealType mealType);
}
