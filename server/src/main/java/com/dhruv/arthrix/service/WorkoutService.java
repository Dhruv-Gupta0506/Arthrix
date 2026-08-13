package com.dhruv.arthrix.service;

import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;

import java.util.List;

public interface WorkoutService {

    List<WorkoutDTO> getAllWorkouts();
    WorkoutDTO getWorkoutById(Long workoutId);
    List<WorkoutDTO> getWorkoutsByGoalAndDifficulty(FitnessGoal goal, Difficulty difficulty);
    void syncWorkoutsFromExternalApi();
}