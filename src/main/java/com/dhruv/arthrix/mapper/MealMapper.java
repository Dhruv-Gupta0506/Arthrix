package com.dhruv.arthrix.mapper;

import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.entity.Meal;

public class MealMapper {
    public static MealDTO toDTO(Meal meal){
        MealDTO dto=new MealDTO();

        dto.setId(meal.getId());
        dto.setCalories(meal.getCalories());
        dto.setFat(meal.getFat());
        dto.setCarbs(meal.getCarbs());
        dto.setDescription(meal.getDescription());
        dto.setMealType(meal.getMealType());
        dto.setName(meal.getName());
        dto.setProtein(meal.getProtein());
        dto.setDietPreference(meal.getDietPreference());
        dto.setFitnessGoal(meal.getFitnessGoal());

        return dto;
    }
}
