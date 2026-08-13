package com.dhruv.arthrix.entity;

import com.dhruv.arthrix.enums.Difficulty;
import com.dhruv.arthrix.enums.FitnessGoal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "workouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    private FitnessGoal fitnessGoal;

    private Integer durationMinutes;

    private Integer estimatedCaloriesBurned;
}