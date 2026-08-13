package com.dhruv.arthrix.client;

import com.dhruv.arthrix.dto.external.NutritionApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Component
public class NutritionClient {

    private final WebClient webClient;

    private static final List<String> SEARCH_TERMS = List.of(
            "chicken", "rice", "salad", "pasta", "soup", "fruit", "vegetable",
            "beef", "fish", "eggs", "bread", "yogurt", "cheese", "potato", "beans"
    );

    @Autowired
    public NutritionClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public List<NutritionApiResponse.Product> fetchAllMeals() {
        List<NutritionApiResponse.Product> allProducts = new ArrayList<>();

        for (String term : SEARCH_TERMS) {
            String url = "https://world.openfoodfacts.org/cgi/search.pl?search_terms=" + term
                    + "&search_simple=1&action=process&json=1&page_size=30";

            try {
                NutritionApiResponse response = webClient.get()
                        .uri(url)
                        .header(HttpHeaders.USER_AGENT, "Arthrix - Fitness App - Student Project")
                        .retrieve()
                        .bodyToMono(NutritionApiResponse.class)
                        .block();

                if (response != null && response.getProducts() != null) {
                    allProducts.addAll(response.getProducts());
                }

                Thread.sleep(500);

            } catch (Exception e) {
                continue;
            }
        }

        return allProducts;
    }
}