package com.bi_service.dto.response;

import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
public class SectorAnalysisResponse {
    private Map<String, Long> sectorDistribution;
    private Map<String, Object> sectorPerformance;
    private Map<String, Object> sectorTrends;
    private List<SectorMetric> topSectors;
    private Map<String, Object> correlations;

    @Data
    public static class SectorMetric {
        private String sectorName;
        private String sectorCode;
        private Double metricValue;
        private Map<String, Object> performance;
        private Map<String, Object> trends;
    }
}
