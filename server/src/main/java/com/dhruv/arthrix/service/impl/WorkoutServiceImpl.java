package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.client.ExerciseClient;
import com.dhruv.arthrix.dto.external.WgerExerciseResponse;
import com.dhruv.arthrix.dto.response.WorkoutDTO;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private static final Logger logger = LogManager.getLogger(WorkoutServiceImpl.class);

    private final WorkoutRepository workoutRepository;
    private final ExerciseClient exerciseClient;

    @Autowired
    public WorkoutServiceImpl(WorkoutRepository workoutRepository, ExerciseClient exerciseClient) {
        this.workoutRepository = workoutRepository;
        this.exerciseClient = exerciseClient;
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
    public void syncWorkoutsFromExternalApi() {
        logger.info("Starting workout sync from Wger external API");

        List<WgerExerciseResponse.WgerExerciseResult> results = exerciseClient.fetchAllExercises();
        logger.debug("Fetched {} raw exercise results from Wger", results.size());

        int savedCount = 0;
        int skippedCount = 0;

        for (WgerExerciseResponse.WgerExerciseResult result : results) {
            String englishName = null;
            String englishDescription = null;

            for (WgerExerciseResponse.WgerTranslation translation : result.getTranslations()) {
                if (translation.getLanguage() == 2) {
                    englishName = translation.getName();
                    englishDescription = translation.getDescription();
                    break;
                }
            }

            if (englishName == null || englishName.isBlank()) {
                skippedCount++;
                continue;
            }

            Workout workout = new Workout();
            workout.setName(englishName);
            workout.setDescription(englishDescription);
            workout.setDifficulty(Difficulty.BEGINNER);
            workout.setFitnessGoal(FitnessGoal.MAINTAIN);

            workoutRepository.save(workout);
            savedCount++;
        }

        logger.info("Workout sync complete — saved={}, skipped (no English translation)={}", savedCount, skippedCount);
    }
}