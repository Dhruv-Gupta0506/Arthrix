package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.client.NutritionClient;
import com.dhruv.arthrix.dto.external.NutritionApiResponse;
import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.entity.Meal;
import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.MealType;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.mapper.MealMapper;
import com.dhruv.arthrix.repository.MealRepository;
import com.dhruv.arthrix.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealServiceImpl implements MealService {

    private final MealRepository mealRepository;
    private final NutritionClient nutritionClient;

    @Autowired
    public MealServiceImpl(MealRepository mealRepository, NutritionClient nutritionClient) {
        this.mealRepository = mealRepository;
        this.nutritionClient = nutritionClient;
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
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + mealId));
        return MealMapper.toDTO(meal);
    }

    @Override
    public List<MealDTO> getMealsByDietPreferenceAndMealType(DietPreference dietPreference, MealType mealType) {
        List<Meal> meals = mealRepository.findByDietPreferenceAndMealType(dietPreference, mealType);
        return meals.stream()
                .map(MealMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void syncMealsFromExternalApi() {
        List<NutritionApiResponse.Product> products = nutritionClient.fetchAllMeals();

        for (NutritionApiResponse.Product product : products) {
            String name = product.getProductName();
            if (name == null || name.isBlank()) {
                continue;
            }

            NutritionApiResponse.Nutriments nutriments = product.getNutriments();
            if (nutriments == null) {
                continue;
            }

            Meal meal = new Meal();
            meal.setName(name);
            meal.setDescription(null);
            meal.setMealType(MealType.LUNCH);
            meal.setDietPreference(DietPreference.VEG);
            meal.setFitnessGoal(FitnessGoal.MAINTAIN);
            meal.setCalories(nutriments.getEnergyKcal100g());
            meal.setProtein(nutriments.getProteins100g());
            meal.setCarbs(nutriments.getCarbohydrates100g());
            meal.setFat(nutriments.getFat100g());

            mealRepository.save(meal);
        }
    }
}