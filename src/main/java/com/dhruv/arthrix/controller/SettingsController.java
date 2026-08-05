package com.dhruv.arthrix.controller;

import com.dhruv.arthrix.dto.request.UpdateProfileRequest;
import com.dhruv.arthrix.dto.response.UserProfileDTO;
import com.dhruv.arthrix.response.ApiResponse;
import com.dhruv.arthrix.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final UserService userService;

    @Autowired
    public SettingsController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getAccountSettings(@PathVariable Long userId) {
        UserProfileDTO profile = userService.getUserProfile(userId);
        ApiResponse<UserProfileDTO> response = ApiResponse.success("Account settings fetched successfully", profile);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateAccountSettings(
            @PathVariable Long userId,
            @RequestBody UpdateProfileRequest request) {

        UserProfileDTO updated = userService.updateUserProfile(userId, request);
        ApiResponse<UserProfileDTO> response = ApiResponse.success("Account settings updated successfully", updated);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PutMapping("/{userId}/theme")
    public ResponseEntity<ApiResponse<Void>> updateTheme(@PathVariable Long userId) {
        ApiResponse<Void> response = ApiResponse.error("Theme customization is not implemented yet");
        return new ResponseEntity<>(response, HttpStatus.NOT_IMPLEMENTED);
    }


    @DeleteMapping("/{userId}/account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Long userId) {
        ApiResponse<Void> response = ApiResponse.error("Account deletion is not implemented yet");
        return new ResponseEntity<>(response, HttpStatus.NOT_IMPLEMENTED);
    }
}