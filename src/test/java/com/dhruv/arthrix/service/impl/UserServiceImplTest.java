package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.entity.User;
import com.dhruv.arthrix.enums.Gender;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.repository.MealRepository;
import com.dhruv.arthrix.repository.UserRepository;
import com.dhruv.arthrix.repository.WorkoutRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkoutRepository workoutRepository;

    @Mock
    private MealRepository mealRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setHeight(175.0);
        testUser.setWeight(70.0);
        testUser.setAge(25);
        testUser.setGender(Gender.MALE);
    }

    @Test
    void calculateBmi_returnsCorrectValue() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        double bmi = userService.calculateBmi(1L);

        assertEquals(22.86, bmi, 0.01);
    }

    @Test
    void calculateBmi_throwsExceptionWhenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.calculateBmi(99L));
    }

    @Test
    void calculateDailyCalories_returnsCorrectValueForMale() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        double calories = userService.calculateDailyCalories(1L);

        assertEquals(2008.5, calories, 0.5);
    }

    @Test
    void calculateProteinNeeds_returnsCorrectValue() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        double protein = userService.calculateProteinNeeds(1L);

        assertEquals(112.0, protein, 0.01);
    }

    @Test
    void calculateProteinNeeds_handlesZeroWeightBoundaryCase() {
        testUser.setWeight(0.0);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        double protein = userService.calculateProteinNeeds(1L);

        assertEquals(0.0, protein, 0.01);
    }
}