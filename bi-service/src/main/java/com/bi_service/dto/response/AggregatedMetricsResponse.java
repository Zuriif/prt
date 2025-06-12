package com.bi_service.dto.response;

import lombok.Data;
import java.util.Map;

@Data
public class AggregatedMetricsResponse {
    private Long totalEntities;
    private Long activeEntities;
    private Map<String, Object> businessMetrics;
    private Map<String, Object> trends;
    private Map<String, Object> correlations;
}
