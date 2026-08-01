package com.dhruv.arthrix.dto.response;

import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutDTO {
    private Long id;
    private String name;
    private String description;
    private Integer durationMinutes;
    private Integer estimatedCaloriesBurned;
    private Difficulty difficulty;
    private FitnessGoal fitnessGoal;
}
