package com.dhruv.arthrix.service;

import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.MuscleGroup;
import com.dhruv.arthrix.enums.WorkoutLocation;

import java.util.List;

public interface WorkoutService {

    List<WorkoutDTO> getAllWorkouts();
    WorkoutDTO getWorkoutById(Long workoutId);
    List<WorkoutDTO> filterWorkouts(FitnessGoal goal, Difficulty difficulty, MuscleGroup muscleGroup, WorkoutLocation location);
    void syncWorkoutsFromExternalApi();
}