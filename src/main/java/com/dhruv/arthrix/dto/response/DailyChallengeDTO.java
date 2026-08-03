package com.dhruv.arthrix.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DailyChallengeDTO {

    private Long id;
    private String title;
    private String description;
    private boolean completed;
}