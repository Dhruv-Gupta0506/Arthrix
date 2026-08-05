package com.dhruv.arthrix.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryDTO {

    private LocalDate startDate;
    private LocalDate endDate;

    private int totalChallengesAssigned;
    private int totalChallengesCompleted;
    private double completionRatePercent;


    private double estimatedCaloriesBurned;
    private double estimatedCaloriesConsumedTarget;
}