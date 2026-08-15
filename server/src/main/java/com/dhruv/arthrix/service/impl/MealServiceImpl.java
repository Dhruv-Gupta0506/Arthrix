package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.dto.response.MealCategoryDTO;
import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.dto.response.MealPlanDTO;
import com.dhruv.arthrix.entity.Meal;
import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.MealType;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.mapper.MealMapper;
import com.dhruv.arthrix.repository.MealRepository;
import com.dhruv.arthrix.service.MealService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealServiceImpl implements MealService {

    private static final Logger logger = LogManager.getLogger(MealServiceImpl.class);

    // Fixed category order shown in the meal plan — matches a normal day's meals.
    private static final List<MealType> CATEGORY_ORDER = List.of(
            MealType.BREAKFAST, MealType.LUNCH, MealType.SNACKS, MealType.DINNER
    );

    private static final int OPTIONS_PER_CATEGORY = 3;

    private final MealRepository mealRepository;

    @Autowired
    public MealServiceImpl(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    @Override
    public List<MealDTO> getAllMeals() {
        List<Meal> meals = mealRepository.findAll();
        return meals.stream()
                .map(MealMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MealDTO getMealById(Long mealId) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> {
                    logger.error("getMealById failed — meal not found, mealId={}", mealId);
                    return new ResourceNotFoundException("Meal not found with id: " + mealId);
                });
        return MealMapper.toDTO(meal);
    }

    @Override
    public List<MealDTO> getMealsByDietPreferenceAndMealType(DietPreference dietPreference, MealType mealType) {
        List<Meal> meals;

        if (dietPreference != null && mealType != null) {
            meals = mealRepository.findByDietPreferenceAndMealType(dietPreference, mealType);
        } else if (dietPreference != null) {
            meals = mealRepository.findByDietPreference(dietPreference);
        } else if (mealType != null) {
            meals = mealRepository.findByMealType(mealType);
        } else {
            meals = mealRepository.findAll();
        }

        logger.debug("Found {} meals for dietPreference={}, mealType={}", meals.size(), dietPreference, mealType);
        return meals.stream()
                .map(MealMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MealPlanDTO generateMealPlan(DietPreference dietPreference, FitnessGoal goal) {
        DietPreference diet = dietPreference == null ? DietPreference.VEG : dietPreference;

        List<MealCategoryDTO> categories = new ArrayList<>();
        for (MealType mealType : CATEGORY_ORDER) {
            categories.add(new MealCategoryDTO(mealType, pickOptionsForCategory(diet, goal, mealType)));
        }

        logger.info("Generated meal plan for dietPreference={}, goal={}", diet, goal);
        return new MealPlanDTO(categories);
    }

    /**
     * Pool is dietPreference + mealType only — NOT goal. Same reasoning as the workout
     * plan generator: the seed data ties specific meals to specific goals, so a hard goal
     * filter starves the pool to 1 option. Instead, goal-matching meals are pushed to the
     * front and the rest fill in behind them, so options stay relevant but there's always
     * enough to rotate.
     */
    private List<MealDTO> pickOptionsForCategory(DietPreference dietPreference, FitnessGoal goal, MealType mealType) {
        List<Meal> pool = mealRepository.findByDietPreferenceAndMealType(dietPreference, mealType);

        List<Meal> goalMatched = pool.stream()
                .filter(m -> m.getFitnessGoal() == goal)
                .collect(Collectors.toList());
        List<Meal> rest = pool.stream()
                .filter(m -> m.getFitnessGoal() != goal)
                .collect(Collectors.toList());

        Collections.shuffle(goalMatched);
        Collections.shuffle(rest);

        List<Meal> ordered = new ArrayList<>(goalMatched);
        ordered.addAll(rest);

        return ordered.stream()
                .limit(OPTIONS_PER_CATEGORY)
                .map(MealMapper::toDTO)
                .collect(Collectors.toList());
    }
}