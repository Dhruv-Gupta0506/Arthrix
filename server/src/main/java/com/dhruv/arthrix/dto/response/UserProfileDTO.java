package com.dhruv.arthrix.dto.response;

import com.dhruv.arthrix.enums.DietPreference;
import com.dhruv.arthrix.enums.FitnessGoal;
import com.dhruv.arthrix.enums.Gender;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UserProfileDTO {
    private Long id;
    private String email;
    private String name;
    private String profilePictureUrl;
    private Integer age;
    private Gender gender;
    private Double height;
    private Double weight;
    private DietPreference dietPreference;
    private FitnessGoal fitnessGoal;
}
