package com.dhruv.arthrix.client;

import com.dhruv.arthrix.dto.external.WgerExerciseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExerciseClient {

    private final WebClient webClient;

    @Autowired
    public ExerciseClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public List<WgerExerciseResponse.WgerExerciseResult> fetchAllExercises() {
        List<WgerExerciseResponse.WgerExerciseResult> allResults = new ArrayList<>();

        String url = "https://wger.de/api/v2/exerciseinfo/?language=2&limit=100";

        while (url != null) {
            WgerExerciseResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(WgerExerciseResponse.class)
                    .block();

            if (response == null || response.getResults() == null) {
                break;
            }

            allResults.addAll(response.getResults());
            url = response.getNext();
        }

        return allResults;
    }
}