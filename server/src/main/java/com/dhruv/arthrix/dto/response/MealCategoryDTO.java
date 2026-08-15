package com.dhruv.arthrix.dto.response;

import com.dhruv.arthrix.enums.MealType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MealCategoryDTO {
    private MealType mealType;
    private List<MealDTO> options;
}