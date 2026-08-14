package com.dhruv.arthrix.repository;

import com.dhruv.arthrix.entity.Workout;
import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.MuscleGroup;
import com.dhruv.arthrix.enums.WorkoutLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    List<Workout> findByFitnessGoalAndDifficulty(FitnessGoal goal, Difficulty difficulty);

    @Query("SELECT w FROM Workout w WHERE " +
            "(:goal IS NULL OR w.fitnessGoal = :goal) AND " +
            "(:difficulty IS NULL OR w.difficulty = :difficulty) AND " +
            "(:muscleGroup IS NULL OR w.muscleGroup = :muscleGroup) AND " +
            "(:location IS NULL OR w.location = :location)")
    List<Workout> filterWorkouts(@Param("goal") FitnessGoal goal,
                                 @Param("difficulty") Difficulty difficulty,
                                 @Param("muscleGroup") MuscleGroup muscleGroup,
                                 @Param("location") WorkoutLocation location);
}