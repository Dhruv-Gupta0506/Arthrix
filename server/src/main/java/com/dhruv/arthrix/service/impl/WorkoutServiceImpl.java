package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.dto.response.DayPlanDTO;
import com.dhruv.arthrix.dto.response.WorkoutDTO;
import com.dhruv.arthrix.dto.response.WorkoutPlanDTO;
import com.dhruv.arthrix.entity.Workout;
import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.MuscleGroup;
import com.dhruv.arthrix.enums.WorkoutLocation;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.mapper.WorkoutMapper;
import com.dhruv.arthrix.repository.WorkoutRepository;
import com.dhruv.arthrix.service.WorkoutService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private static final Logger logger = LogManager.getLogger(WorkoutServiceImpl.class);

    // Fixed weekly split — repeats to fill however many days/week the user picks.
    private static final List<List<MuscleGroup>> WEEKLY_SPLIT = List.of(
            List.of(MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS),
            List.of(MuscleGroup.BACK, MuscleGroup.BICEPS),
            List.of(MuscleGroup.LEGS, MuscleGroup.CORE)
    );

    private static final int EXERCISES_PER_MUSCLE_GROUP = 3;
    private static final int MAX_DAYS = 7;

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
                .orElseThrow(() -> {
                    logger.error("getWorkoutById failed — workout not found, workoutId={}", workoutId);
                    return new ResourceNotFoundException("Workout not found with id: " + workoutId);
                });
        return WorkoutMapper.toDTO(workout);
    }

    @Override
    public List<WorkoutDTO> filterWorkouts(FitnessGoal goal, Difficulty difficulty, MuscleGroup muscleGroup, WorkoutLocation location) {
        List<Workout> workouts = workoutRepository.filterWorkouts(goal, difficulty, muscleGroup, location);
        logger.debug("Found {} workouts for goal={}, difficulty={}, muscleGroup={}, location={}",
                workouts.size(), goal, difficulty, muscleGroup, location);
        return workouts.stream()
                .map(WorkoutMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutPlanDTO generateWorkoutPlan(FitnessGoal goal, Difficulty difficulty, WorkoutLocation location, int daysPerWeek) {
        int totalDays = daysPerWeek <= 0 ? 3 : Math.min(daysPerWeek, MAX_DAYS);

        List<DayPlanDTO> days = new ArrayList<>();

        for (int day = 1; day <= totalDays; day++) {
            List<MuscleGroup> muscleGroupsForDay = WEEKLY_SPLIT.get((day - 1) % WEEKLY_SPLIT.size());
            List<WorkoutDTO> exercises = new ArrayList<>();

            for (MuscleGroup muscleGroup : muscleGroupsForDay) {
                exercises.addAll(pickExercisesForMuscleGroup(goal, difficulty, muscleGroup, location));
            }

            days.add(new DayPlanDTO(day, muscleGroupsForDay, exercises));
        }

        logger.info("Generated {}-day plan for goal={}, difficulty={}, location={}", totalDays, goal, difficulty, location);
        return new WorkoutPlanDTO(days);
    }

    /**
     * Pool is difficulty + muscleGroup + location — NOT goal. The seed data ties specific
     * exercise names to specific goals (e.g. only 2 CHEST/GYM exercises are tagged GAIN_MUSCLE),
     * so hard-filtering by goal here starves the pool down to 1-2 exercises per day. Instead,
     * goal-matching exercises are pushed to the front of the pool, and the rest fill in behind
     * them — so the plan stays relevant to the goal but still has enough exercises to rotate.
     */
    private List<WorkoutDTO> pickExercisesForMuscleGroup(FitnessGoal goal, Difficulty difficulty, MuscleGroup muscleGroup, WorkoutLocation location) {
        List<Workout> pool = workoutRepository.filterWorkouts(null, difficulty, muscleGroup, location);

        if (pool.isEmpty()) {
            pool = workoutRepository.filterWorkouts(null, difficulty, muscleGroup, null);
        }
        if (pool.isEmpty()) {
            pool = workoutRepository.filterWorkouts(null, null, muscleGroup, location);
        }

        List<Workout> goalMatched = pool.stream()
                .filter(w -> w.getFitnessGoal() == goal)
                .collect(Collectors.toList());
        List<Workout> rest = pool.stream()
                .filter(w -> w.getFitnessGoal() != goal)
                .collect(Collectors.toList());

        Collections.shuffle(goalMatched);
        Collections.shuffle(rest);

        List<Workout> ordered = new ArrayList<>(goalMatched);
        ordered.addAll(rest);

        return ordered.stream()
                .limit(EXERCISES_PER_MUSCLE_GROUP)
                .map(WorkoutMapper::toDTO)
                .collect(Collectors.toList());
    }
}