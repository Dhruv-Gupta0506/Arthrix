package com.dhruv.arthrix.dto.request;

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
public class UpdateProfileRequest {

    private Integer age;
    private Gender gender;
    private Double height;
    private Double weight;
    private DietPreference dietPreference;
    private FitnessGoal fitnessGoal;
}
