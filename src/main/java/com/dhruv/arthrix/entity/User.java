package com.dhruv.arthrix.entity;

import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private String googleId;

    @Column(nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    private String profilePictureUrl;

    private Integer age;

    private Double height;

    private Double weight;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private DietPreference dietPreference;

    @Enumerated(EnumType.STRING)
    private FitnessGoal fitnessGoal;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_workouts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "workout_id")
    )

    private List<Workout> favoriteWorkouts;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_meals",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "meal_id")
    )
    private List<Meal> favoriteMeals;

}
