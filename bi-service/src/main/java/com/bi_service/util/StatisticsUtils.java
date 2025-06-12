package com.bi_service.util;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StatisticsUtils {

    public static double calculateMean(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return 0.0;
        }
        return values.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
    }

    public static double calculateMedian(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return 0.0;
        }
        List<Double> sortedValues = values.stream()
                .sorted()
                .collect(Collectors.toList());
        int size = sortedValues.size();
        if (size % 2 == 0) {
            return (sortedValues.get(size / 2 - 1) + sortedValues.get(size / 2)) / 2.0;
        } else {
            return sortedValues.get(size / 2);
        }
    }

    public static double calculateStandardDeviation(List<Double> values) {
        if (values == null || values.size() < 2) {
            return 0.0;
        }
        double mean = calculateMean(values);
        double variance = values.stream()
                .mapToDouble(value -> Math.pow(value - mean, 2))
                .average()
                .orElse(0.0);
        return Math.sqrt(variance);
    }

    public static double calculateGrowthRate(List<Double> values) {
        if (values == null || values.size() < 2) {
            return 0.0;
        }
        double firstValue = values.get(0);
        double lastValue = values.get(values.size() - 1);
        return ((lastValue - firstValue) / firstValue) * 100;
    }

    public static Map<String, Double> calculateMovingAverage(List<Double> values, int window) {
        if (values == null || values.isEmpty() || window <= 0) {
            return Map.of();
        }
        return values.stream()
                .collect(Collectors.toMap(
                    value -> String.valueOf(values.indexOf(value)),
                    value -> {
                        int start = Math.max(0, values.indexOf(value) - window + 1);
                        List<Double> windowValues = values.subList(start, values.indexOf(value) + 1);
                        return calculateMean(windowValues);
                    }
                ));
    }

    public static double calculateCorrelation(List<Double> x, List<Double> y) {
        if (x == null || y == null || x.size() != y.size() || x.isEmpty()) {
            return 0.0;
        }
        double meanX = calculateMean(x);
        double meanY = calculateMean(y);
        double sumXY = 0.0;
        double sumX2 = 0.0;
        double sumY2 = 0.0;

        for (int i = 0; i < x.size(); i++) {
            double xDiff = x.get(i) - meanX;
            double yDiff = y.get(i) - meanY;
            sumXY += xDiff * yDiff;
            sumX2 += xDiff * xDiff;
            sumY2 += yDiff * yDiff;
        }

        if (sumX2 == 0.0 || sumY2 == 0.0) {
            return 0.0;
        }

        return sumXY / Math.sqrt(sumX2 * sumY2);
    }
}
