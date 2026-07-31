package com.dhruv.arthrix.mapper;

import com.dhruv.arthrix.dto.response.UserProfileDTO;
import com.dhruv.arthrix.entity.User;

public class UserMapper {
    public static UserProfileDTO toDTO(User user){
        UserProfileDTO dto = new UserProfileDTO();

        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setHeight(user.getHeight());
        dto.setWeight(user.getWeight());
        dto.setDietPreference(user.getDietPreference());
        dto.setFitnessGoal(user.getFitnessGoal());

        return dto;
    }
}
