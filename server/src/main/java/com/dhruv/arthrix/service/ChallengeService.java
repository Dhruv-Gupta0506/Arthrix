package com.dhruv.arthrix.service;

import com.dhruv.arthrix.dto.response.DailyChallengeDTO;

import java.util.List;

public interface ChallengeService {

    List<DailyChallengeDTO> getTodayChallenges(Long userId);
    void completeChallenge(Long userChallengeId);
    int getStreak(Long userId);
}