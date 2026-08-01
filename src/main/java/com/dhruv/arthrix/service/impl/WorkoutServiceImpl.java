package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.entity.Workout;
import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.mapper.WorkoutMapper;
import com.dhruv.arthrix.repository.WorkoutRepository;
import com.dhruv.arthrix.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;

    @Autowired
    public WorkoutServiceImpl(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    @Override
    public List<WorkoutDTO> getAllWorkouts() {
        List<Workout> workouts = workoutRepository.findAll();
        return workouts.stream()
                .map(WorkoutMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutDTO getWorkoutById(Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + workoutId));
        return WorkoutMapper.toDTO(workout);
    }

    @Override
    public List<WorkoutDTO> getWorkoutsByGoalAndDifficulty(FitnessGoal goal, Difficulty difficulty) {
        List<Workout> workouts = workoutRepository.findByFitnessGoalAndDifficulty(goal, difficulty);
        return workouts.stream()
                .map(WorkoutMapper::toDTO)
                .collect(Collectors.toList());
    }
}