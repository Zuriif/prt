package com.bi_service.dto.response;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class TimeSeriesResponse {
    private List<TimeSeriesDataPoint> data;
    private Map<String, List<Double>> movingAverages;
    private Map<String, List<Double>> forecasts;
    private Map<String, Object> statistics;

    @Data
    public static class TimeSeriesDataPoint {
        private String date;
        private Double value;
        private Map<String, Object> additionalMetrics;
    }
}
