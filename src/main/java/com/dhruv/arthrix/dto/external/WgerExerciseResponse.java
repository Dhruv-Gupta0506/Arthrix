package com.dhruv.arthrix.dto.external;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WgerExerciseResponse {

    private String next;
    private List<WgerExerciseResult> results;

    @Getter
    @Setter
    public static class WgerExerciseResult {
        private Long id;
        private List<WgerTranslation> translations;
    }

    @Getter
    @Setter
    public static class WgerTranslation {
        private Long language;
        private String name;
        private String description;
    }
}