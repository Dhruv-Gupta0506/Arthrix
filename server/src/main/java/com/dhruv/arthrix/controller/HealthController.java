package com.dhruv.arthrix.controller;

import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<String>> checkHealth() {
        ApiResponse<String> response = ApiResponse.success("Arthrix Backend is running smoothly!", "v1.0.0");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/test-error")
    public ResponseEntity<ApiResponse<Void>> testError() {
        throw new ResourceNotFoundException("Test Exception: Triggered deliberately to test GlobalExceptionHandler");
    }
}