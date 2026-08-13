package com.dhruv.arthrix.mapper;

import com.dhruv.arthrix.dto.response.DailyChallengeDTO;
import com.dhruv.arthrix.entity.UserDailyChallenge;

public class ChallengeMapper {

    public static DailyChallengeDTO toDTO(UserDailyChallenge userDailyChallenge) {
        DailyChallengeDTO dto = new DailyChallengeDTO();

        dto.setId(userDailyChallenge.getId());
        dto.setTitle(userDailyChallenge.getDailyChallenge().getTitle());
        dto.setDescription(userDailyChallenge.getDailyChallenge().getDescription());
        dto.setCompleted(userDailyChallenge.isCompleted());

        return dto;
    }
}