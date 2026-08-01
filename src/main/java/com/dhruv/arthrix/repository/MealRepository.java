package com.dhruv.arthrix.repository;

import com.dhruv.arthrix.entity.Meal;
import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal,Long> {
    List<Meal> findByDietPreferenceAndMealType(DietPreference dietPreference, MealType mealType);
}
