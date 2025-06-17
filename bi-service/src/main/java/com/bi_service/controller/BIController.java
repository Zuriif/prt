package com.bi_service.controller;

import com.bi_service.dto.request.TimeframeRequest;
import com.bi_service.dto.response.AggregatedMetricsResponse;
import com.bi_service.service.BIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@RestController
@RequestMapping("/api/bi")
@RequiredArgsConstructor
public class BIController {

    private final BIService biService;

    @PostMapping("/aggregate")
    public ResponseEntity<AggregatedMetricsResponse> aggregate(
            @RequestHeader("Authorization") String token,
            @RequestBody TimeframeRequest request) {
        return ResponseEntity.ok(biService.getAggregatedMetrics(token, request));
    }

    @GetMapping("/timeseries")
    public ResponseEntity<Map<String, Object>> timeseries(
            @RequestHeader("Authorization") String token,
            @RequestParam String metric,
            @RequestParam String interval,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "false") boolean includeForecast) {
        // You may need to build a request object from params if your service expects it
        return ResponseEntity.ok(biService.getTimeSeriesAnalysis(token, metric, interval, startDate, endDate, includeForecast));
    }

    @GetMapping("/entity-analytics")
    public ResponseEntity<Map<String, Object>> getEntityAnalytics(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(biService.getEntityAnalytics(token));
    }

    @GetMapping("/sector-analysis")
    public ResponseEntity<Map<String, Object>> getSectorAnalysis(
            @RequestHeader("Authorization") String token) {
        System.out.println("=== SECTOR ANALYSIS REQUEST ===");
        Map<String, Object> analysis = biService.getSectorAnalysis(token);
        try {
            System.out.println("Sector Analysis Response: " + new ObjectMapper().writeValueAsString(analysis));
        } catch (Exception e) {
            System.out.println("Error serializing sector analysis: " + e.getMessage());
        }
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/timeseries/products")
    public ResponseEntity<Map<String, Object>> getProductTimeSeries(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "monthly") String interval) {
        return ResponseEntity.ok(biService.getProductTimeSeries(token, interval));
    }

    @GetMapping("/correlations/business")
    public ResponseEntity<Map<String, Object>> getBusinessCorrelations(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(biService.getBusinessCorrelations(token));
    }

    @GetMapping("/scorecard")
    public ResponseEntity<Map<String, Object>> getBusinessScorecard(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(biService.getBusinessScorecard(token));
    }
}
