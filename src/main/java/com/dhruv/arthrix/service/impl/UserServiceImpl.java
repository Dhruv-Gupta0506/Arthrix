package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.dto.request.UpdateProfileRequest;
import com.dhruv.arthrix.dto.response.UserProfileDTO;
import com.dhruv.arthrix.entity.User;
import com.dhruv.arthrix.enums.Gender;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.mapper.UserMapper;
import com.dhruv.arthrix.repository.UserRepository;
import com.dhruv.arthrix.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return UserMapper.toDTO(user);
    }

    @Override
    public UserProfileDTO updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setHeight(request.getHeight());
        user.setWeight(request.getWeight());
        user.setDietPreference(request.getDietPreference());
        user.setFitnessGoal(request.getFitnessGoal());

        User updatedUser = userRepository.save(user);
        return UserMapper.toDTO(updatedUser);
    }

    @Override
    public double calculateBmi(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        double heightInMeters = user.getHeight() / 100;
        return user.getWeight() / (heightInMeters * heightInMeters);
    }

    @Override
    public double calculateDailyCalories(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        double bmr;
        if (user.getGender() == Gender.MALE) {
            bmr = (10 * user.getWeight()) + (6.25 * user.getHeight()) - (5 * user.getAge()) + 5;
        } else {
            bmr = (10 * user.getWeight()) + (6.25 * user.getHeight()) - (5 * user.getAge()) - 161;
        }

        return bmr * 1.2;
    }

    @Override
    public double calculateProteinNeeds(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return user.getWeight() * 1.6;
    }
}