package com.dhruv.arthrix.service;

import com.dhruv.arthrix.dto.response.AnalyticsSummaryDTO;
import com.dhruv.arthrix.dto.response.DashboardDTO;

public interface DashboardService {

    DashboardDTO getDashboard(Long userId);
    AnalyticsSummaryDTO getWeeklyAnalytics(Long userId);
    AnalyticsSummaryDTO getMonthlyAnalytics(Long userId);
}