package com.bi_service.service;

import com.bi_service.util.DateUtils;
import com.bi_service.util.StatisticsUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DataProcessingService {

    public Map<String, Object> processTimeSeriesData(List<Map<String, Object>> rawData, String interval) {
        Map<String, Object> result = new HashMap<>();
        Map<String, List<Double>> timeSeriesData = new HashMap<>();
        Map<String, List<Double>> movingAverages = new HashMap<>();
        Map<String, List<Double>> forecasts = new HashMap<>();

        // Group data by interval
        rawData.forEach(data -> {
            String dateStr = (String) data.get("date");
            LocalDateTime date = DateUtils.parseDateTime(dateStr);
            String intervalKey = DateUtils.getIntervalKey(date, interval);
            
            Double value = ((Number) data.get("value")).doubleValue();
            timeSeriesData.computeIfAbsent(intervalKey, k -> new ArrayList<>()).add(value);
        });

        // Calculate moving averages
        timeSeriesData.forEach((key, values) -> {
            movingAverages.put(key, new ArrayList<>(StatisticsUtils.calculateMovingAverage(values, 7).values()));
        });

        // Generate forecasts
        timeSeriesData.forEach((key, values) -> {
            List<Double> forecast = new ArrayList<>();
            if (!values.isEmpty()) {
                double lastValue = values.get(values.size() - 1);
                double growthRate = StatisticsUtils.calculateGrowthRate(values);
                for (int i = 0; i < 12; i++) { // Forecast next 12 periods
                    forecast.add(lastValue * (1 + (growthRate / 100) * (i + 1)));
                }
            }
            forecasts.put(key, forecast);
        });

        result.put("timeSeriesData", timeSeriesData);
        result.put("movingAverages", movingAverages);
        result.put("forecasts", forecasts);

        return result;
    }

    public Map<String, Object> processEntityData(List<Map<String, Object>> rawData) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Long> distribution = new HashMap<>();
        Map<String, Object> performance = new HashMap<>();
        Map<String, Object> growth = new HashMap<>();

        if (rawData == null) {
            result.put("distribution", distribution);
            result.put("performance", performance);
            result.put("growth", growth);
            return result;
        }

        // Process distribution
        rawData.forEach(data -> {
            if (data != null) {
                String type = (String) data.get("type");
                if (type != null) {
                    distribution.merge(type, 1L, Long::sum);
                }
            }
        });

        // Process performance metrics
        Map<String, List<Double>> performanceMetrics = new HashMap<>();
        rawData.forEach(data -> {
            if (data != null) {
                String type = (String) data.get("type");
                Object valueObj = data.get("value");
                if (type != null && valueObj != null) {
                    try {
                        Double value = ((Number) valueObj).doubleValue();
                        performanceMetrics.computeIfAbsent(type, k -> new ArrayList<>()).add(value);
                    } catch (ClassCastException | NullPointerException e) {
                        // Skip invalid values
                    }
                }
            }
        });

        performanceMetrics.forEach((type, values) -> {
            if (values != null && !values.isEmpty()) {
                Map<String, Object> metrics = new HashMap<>();
                metrics.put("mean", StatisticsUtils.calculateMean(values));
                metrics.put("median", StatisticsUtils.calculateMedian(values));
                metrics.put("stdDev", StatisticsUtils.calculateStandardDeviation(values));
                performance.put(type, metrics);
            }
        });

        result.put("distribution", distribution);
        result.put("performance", performance);
        result.put("growth", growth);

        return result;
    }

    public Map<String, Object> processSectorData(List<Map<String, Object>> rawData) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Long> distribution = new HashMap<>();
        Map<String, Object> performance = new HashMap<>();
        Map<String, Object> trends = new HashMap<>();

        // Process distribution
        rawData.forEach(data -> {
            String sector = (String) data.get("sector");
            distribution.merge(sector, 1L, Long::sum);
        });

        // Process performance metrics
        Map<String, List<Double>> performanceMetrics = new HashMap<>();
        rawData.forEach(data -> {
            String sector = (String) data.get("sector");
            Double value = ((Number) data.get("value")).doubleValue();
            performanceMetrics.computeIfAbsent(sector, k -> new ArrayList<>()).add(value);
        });

        performanceMetrics.forEach((sector, values) -> {
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("mean", StatisticsUtils.calculateMean(values));
            metrics.put("median", StatisticsUtils.calculateMedian(values));
            metrics.put("stdDev", StatisticsUtils.calculateStandardDeviation(values));
            metrics.put("growthRate", StatisticsUtils.calculateGrowthRate(values));
            performance.put(sector, metrics);
        });

        result.put("distribution", distribution);
        result.put("performance", performance);
        result.put("trends", trends);

        return result;
    }
}
