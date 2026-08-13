package com.dhruv.arthrix.dto.response;

import com.dhruv.arthrix.enums.FitnessGoal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {


    private String userName;
    private String profilePictureUrl;
    private FitnessGoal fitnessGoal;


    private Double bmi;
    private Double dailyCalorieGoal;
    private Double dailyProteinGoal;


    private Integer currentStreak;
    private List<DailyChallengeDTO> todayChallenges;
    private int challengesCompletedToday;
    private int challengesTotalToday;


    private WorkoutDTO recommendedWorkout;
    private MealDTO recommendedMeal;
}