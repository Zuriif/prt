package com.bi_service.dto.response;

import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
public class EntityAnalyticsResponse {
    private Map<String, Long> entityDistribution;
    private Map<String, Object> performance;
    private Map<String, Object> growth;
    private List<EntityMetric> topEntities;
    private Map<String, Object> trends;

    @Data
    public static class EntityMetric {
        private String entityId;
        private String entityName;
        private String entityType;
        private Double metricValue;
        private Map<String, Object> additionalMetrics;
    }
}
