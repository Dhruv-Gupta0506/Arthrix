package com.dhruv.arthrix.dto.response;

import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.MealType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MealDTO {
    private Long id;
    private String name;
    private String description;
    private Double fat;
    private Double calories;
    private Double protein;
    private Double carbs;
    private FitnessGoal fitnessGoal;
    private MealType mealType;
    private DietPreference dietPreference;
}
