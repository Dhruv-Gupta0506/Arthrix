package com.dhruv.arthrix.controller;

import com.dhruv.arthrix.dto.response.DailyChallengeDTO;
import com.dhruv.arthrix.response.ApiResponse;
import com.dhruv.arthrix.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    @Autowired
    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping("/today/{userId}")
    public ResponseEntity<ApiResponse<List<DailyChallengeDTO>>> getTodayChallenges(@PathVariable Long userId) {
        List<DailyChallengeDTO> challenges = challengeService.getTodayChallenges(userId);
        ApiResponse<List<DailyChallengeDTO>> response = ApiResponse.success("Today's challenges fetched successfully", challenges);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{userChallengeId}/complete")
    public ResponseEntity<ApiResponse<Void>> completeChallenge(@PathVariable Long userChallengeId) {
        challengeService.completeChallenge(userChallengeId);
        ApiResponse<Void> response = ApiResponse.success("Challenge marked as complete", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/streak/{userId}")
    public ResponseEntity<ApiResponse<Integer>> getStreak(@PathVariable Long userId) {
        int streak = challengeService.getStreak(userId);
        ApiResponse<Integer> response = ApiResponse.success("Streak fetched successfully", streak);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}