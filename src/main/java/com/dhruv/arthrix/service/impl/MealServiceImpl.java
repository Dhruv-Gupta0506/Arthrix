package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.dto.response.MealDTO;
import com.dhruv.arthrix.entity.Meal;
import com.dhruv.arthrix.enums.DietPreference;
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

    @Autowired
    public MealServiceImpl(MealRepository mealRepository){
        this.mealRepository=mealRepository;
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
    public List<MealDTO> getMealsByDietPreferenceAndMealType(DietPreference dietPreference , MealType mealType){
        List<Meal> meals=mealRepository.findByDietPreferenceAndMealType(dietPreference,mealType);
        return meals.stream()
                .map(MealMapper::toDTO)
                .collect(Collectors.toList());

    }
}

