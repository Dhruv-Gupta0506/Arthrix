package com.dhruv.arthrix.entity;

import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

}
