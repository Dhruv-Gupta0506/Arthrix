package com.dhruv.arthrix.mapper;

import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.entity.Workout;

public class WorkoutMapper {
    public static WorkoutDTO toDTO(Workout workout){
        WorkoutDTO dto=new WorkoutDTO();

        dto.setId(workout.getId());
        dto.setName(workout.getName());
        dto.setDurationMinutes(workout.getDurationMinutes());
        dto.setDifficulty(workout.getDifficulty());
        dto.setFitnessGoal(workout.getFitnessGoal());
        dto.setDescription(workout.getDescription());
        dto.setEstimatedCaloriesBurned(workout.getEstimatedCaloriesBurned());
        dto.setMuscleGroup(workout.getMuscleGroup());
        dto.setLocation(workout.getLocation());

        return dto;
    }
}
