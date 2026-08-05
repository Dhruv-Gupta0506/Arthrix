package com.dhruv.arthrix.controller;

import com.dhruv.arthrix.dto.response.AnalyticsSummaryDTO;
import com.dhruv.arthrix.dto.response.DashboardDTO;
import com.dhruv.arthrix.response.ApiResponse;
import com.dhruv.arthrix.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }


    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<DashboardDTO>> getDashboard(@PathVariable Long userId) {
        DashboardDTO dashboard = dashboardService.getDashboard(userId);
        ApiResponse<DashboardDTO> response = ApiResponse.success("Dashboard fetched successfully", dashboard);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/{userId}/analytics/weekly")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDTO>> getWeeklyAnalytics(@PathVariable Long userId) {
        AnalyticsSummaryDTO analytics = dashboardService.getWeeklyAnalytics(userId);
        ApiResponse<AnalyticsSummaryDTO> response = ApiResponse.success("Weekly analytics fetched successfully", analytics);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}/analytics/monthly")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDTO>> getMonthlyAnalytics(@PathVariable Long userId) {
        AnalyticsSummaryDTO analytics = dashboardService.getMonthlyAnalytics(userId);
        ApiResponse<AnalyticsSummaryDTO> response = ApiResponse.success("Monthly analytics fetched successfully", analytics);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}