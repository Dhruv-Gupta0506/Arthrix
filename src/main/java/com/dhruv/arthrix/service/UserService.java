package com.dhruv.arthrix.service;

import com.dhruv.arthrix.dto.request.UpdateProfileRequest;
import com.dhruv.arthrix.dto.response.UserProfileDTO;

public interface UserService {

    UserProfileDTO getUserProfile(Long userId);

    UserProfileDTO updateUserProfile(Long userId, UpdateProfileRequest request);

    double calculateBmi(Long userId);

    double calculateDailyCalories(Long userId);

    double calculateProteinNeeds(Long userId);
}
