package com.dhruv.arthrix.repository;
import com.dhruv.arthrix.entity.Workout;
import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout,Long > {
    List<Workout> findByFitnessGoalAndDifficulty(FitnessGoal goal, Difficulty difficulty);
}
