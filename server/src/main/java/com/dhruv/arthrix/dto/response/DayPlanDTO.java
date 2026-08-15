package com.dhruv.arthrix.dto.response;

import com.dhruv.arthrix.enums.MuscleGroup;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DayPlanDTO {
    private int dayNumber;
    private List<MuscleGroup> muscleGroups;
    private List<WorkoutDTO> exercises;
}