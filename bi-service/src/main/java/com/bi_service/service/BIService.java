package com.bi_service.service;

import com.bi_service.dto.request.TimeframeRequest;
import com.bi_service.dto.response.AggregatedMetricsResponse;
import com.bi_service.feign.EntiteClient;
import com.bi_service.feign.ProductClient;
import com.bi_service.feign.ParametrageClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
@RequiredArgsConstructor
public class BIService {

    private final EntiteClient entiteClient;
    private final DataProcessingService dataProcessingService;
    private final ProductClient productClient;
    private final ParametrageClient parametrageClient;

    public AggregatedMetricsResponse getAggregatedMetrics(String token, TimeframeRequest request) {
        Object entiteData = entiteClient.getAllEntites(token);
        AggregatedMetricsResponse response = new AggregatedMetricsResponse();
        
        if (entiteData != null) {
            try {
                List<Map<String, Object>> entities = (List<Map<String, Object>>) entiteData;
                
                // Calculate total and active entities
                response.setTotalEntities((long) entities.size());
                response.setActiveEntities(entities.stream()
                    .filter(e -> Boolean.TRUE.equals(e.get("active")))
                    .count());
                
                // Process entity metrics
                Map<String, Object> entityMetrics = dataProcessingService.processEntityData(entities);
                response.setTrends(entityMetrics);
                
                // Calculate business metrics
                Map<String, Object> businessMetrics = new HashMap<>();
                businessMetrics.put("totalEntities", response.getTotalEntities());
                businessMetrics.put("activeEntities", response.getActiveEntities());
                businessMetrics.put("entityTypes", entityMetrics.get("distribution"));
                businessMetrics.put("performance", entityMetrics.get("performance"));
                response.setBusinessMetrics(businessMetrics);
                
                // Calculate correlations
                Map<String, Object> correlations = new HashMap<>();
                if (entityMetrics.containsKey("performance")) {
                    Map<String, Object> performance = (Map<String, Object>) entityMetrics.get("performance");
                    correlations.put("entityPerformance", calculateCorrelations(performance));
                }
                response.setCorrelations(correlations);
                
            } catch (Exception e) {
                // If processing fails, set empty metrics
                response.setTrends(new HashMap<>());
                response.setBusinessMetrics(new HashMap<>());
                response.setCorrelations(new HashMap<>());
            }
        } else {
            response.setTrends(new HashMap<>());
            response.setBusinessMetrics(new HashMap<>());
            response.setCorrelations(new HashMap<>());
        }
        
        return response;
    }

    private Map<String, Double> calculateCorrelations(Map<String, Object> performance) {
        Map<String, Double> correlations = new HashMap<>();
        try {
            // Convert performance metrics to lists for correlation calculation
            Map<String, List<Double>> metrics = new HashMap<>();
            performance.forEach((key, value) -> {
                if (value instanceof Map) {
                    Map<String, Object> metricData = (Map<String, Object>) value;
                    if (metricData.containsKey("values")) {
                        metrics.put(key, (List<Double>) metricData.get("values"));
                    }
                }
            });
            
            // Calculate correlations between metrics
            List<String> metricKeys = new ArrayList<>(metrics.keySet());
            for (int i = 0; i < metricKeys.size(); i++) {
                for (int j = i + 1; j < metricKeys.size(); j++) {
                    String metric1 = metricKeys.get(i);
                    String metric2 = metricKeys.get(j);
                    List<Double> values1 = metrics.get(metric1);
                    List<Double> values2 = metrics.get(metric2);
                    
                    if (values1 != null && values2 != null && values1.size() == values2.size()) {
                        double correlation = calculatePearsonCorrelation(values1, values2);
                        correlations.put(metric1 + "_" + metric2, correlation);
                    }
                }
            }
        } catch (Exception e) {
            // If correlation calculation fails, return empty map
        }
        return correlations;
    }

    private double calculatePearsonCorrelation(List<Double> x, List<Double> y) {
        if (x.size() != y.size() || x.isEmpty()) {
            return 0.0;
        }

        double sumX = 0.0, sumY = 0.0, sumXY = 0.0;
        double sumX2 = 0.0, sumY2 = 0.0;
        int n = x.size();

        for (int i = 0; i < n; i++) {
            sumX += x.get(i);
            sumY += y.get(i);
            sumXY += x.get(i) * y.get(i);
            sumX2 += x.get(i) * x.get(i);
            sumY2 += y.get(i) * y.get(i);
        }

        double numerator = n * sumXY - sumX * sumY;
        double denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        return denominator == 0 ? 0 : numerator / denominator;
    }

    public Map<String, Object> getTimeSeriesAnalysis(String token, TimeframeRequest request) {
        // Return empty/mock data since business-service is not available
        Map<String, Object> mockTimeSeries = new HashMap<>();
        mockTimeSeries.put("timeSeriesData", new HashMap<>());
        mockTimeSeries.put("movingAverages", new HashMap<>());
        mockTimeSeries.put("forecasts", new HashMap<>());
        return mockTimeSeries;
    }

    public Map<String, Object> getTimeSeriesAnalysis(String token, String metric, String interval, String startDate, String endDate, boolean includeForecast) {
        TimeframeRequest request = new TimeframeRequest();
        request.setMetric(metric);
        request.setInterval(interval);
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return getTimeSeriesAnalysis(token, request);
    }

    public Map<String, Object> getEntityAnalytics(String token) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get entities from entite service
            Object entiteData = entiteClient.getAllEntites(token);
            // Get type entreprises from parametrage service
            Object typeEntreprisesData = parametrageClient.getAllTypeEntreprises(token);
            
            if (entiteData != null && typeEntreprisesData != null) {
                List<Map<String, Object>> entities = (List<Map<String, Object>>) entiteData;
                List<Map<String, Object>> typeEntreprises = (List<Map<String, Object>>) typeEntreprisesData;
                
                // Initialize distribution map
                Map<String, Long> typeEntrepriseDistribution = new HashMap<>();
                Map<String, Object> typeEntrepriseDetails = new HashMap<>();
                
                // First, initialize all type entreprises with 0 count
                for (Map<String, Object> type : typeEntreprises) {
                    String typeName = (String) type.get("nom");
                    if (typeName != null) {
                        typeEntrepriseDistribution.put(typeName, 0L);
                        typeEntrepriseDetails.put(typeName, new HashMap<String, Object>() {{
                            put("id", type.get("id"));
                            put("description", type.get("description"));
                            put("type", type.get("type"));
                            put("status", type.get("status"));
                        }});
                    }
                }
                
                // Count entities for each type entreprise
                for (Map<String, Object> entity : entities) {
                    Long typeEntrepriseId = (Long) entity.get("typeEntrepriseId");
                    if (typeEntrepriseId != null) {
                        // Find the type entreprise name for this ID
                        for (Map<String, Object> type : typeEntreprises) {
                            if (typeEntrepriseId.equals(type.get("id"))) {
                                String typeName = (String) type.get("nom");
                                if (typeName != null) {
                                    typeEntrepriseDistribution.merge(typeName, 1L, Long::sum);
                                }
                                break;
                            }
                        }
                    }
                }
                
                // Calculate percentages and additional metrics
                Map<String, Object> performance = new HashMap<>();
                for (String typeName : typeEntrepriseDistribution.keySet()) {
                    Map<String, Object> metrics = new HashMap<>();
                    Long count = typeEntrepriseDistribution.get(typeName);
                    metrics.put("count", count);
                    metrics.put("percentage", (double) count / entities.size() * 100);
                    metrics.put("details", typeEntrepriseDetails.get(typeName));
                    performance.put(typeName, metrics);
                }
                
                result.put("entityDistribution", typeEntrepriseDistribution);
                result.put("performance", performance);
                result.put("totalEntities", (long) entities.size());
                result.put("totalTypes", (long) typeEntreprises.size());
            }
        } catch (Exception e) {
            System.out.println("Error processing entity analytics: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Ensure we always return all required fields, even if empty
        if (!result.containsKey("entityDistribution")) result.put("entityDistribution", new HashMap<>());
        if (!result.containsKey("performance")) result.put("performance", new HashMap<>());
        if (!result.containsKey("totalEntities")) result.put("totalEntities", 0L);
        if (!result.containsKey("totalTypes")) result.put("totalTypes", 0L);
        
        return result;
    }

    public Map<String, Object> getSectorAnalysis(String token) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get sector definitions from parametrage service
            System.out.println("Fetching sectors from parametrage service...");
            Object secteursData = parametrageClient.getAllSecteurs(token);
            System.out.println("Secteurs data received: " + secteursData);
            
            System.out.println("Fetching sous-secteurs from parametrage service...");
            Object sousSecteursData = parametrageClient.getAllSousSecteurs(token);
            System.out.println("Sous-secteurs data received: " + sousSecteursData);
            
            // Get entity data
            System.out.println("Fetching entities from entite service...");
            Object entiteData = entiteClient.getAllEntites(token);
            System.out.println("Entities data received: " + entiteData);
            
            if (entiteData != null && secteursData != null && sousSecteursData != null) {
                List<Map<String, Object>> entities = (List<Map<String, Object>>) entiteData;
                List<Map<String, Object>> secteurs = (List<Map<String, Object>>) secteursData;
                List<Map<String, Object>> sousSecteurs = (List<Map<String, Object>>) sousSecteursData;
                
                System.out.println("Number of entities: " + entities.size());
                System.out.println("Number of sectors: " + secteurs.size());
                System.out.println("Number of sous-secteurs: " + sousSecteurs.size());
                
                // Initialize maps for sector analysis
                Map<String, Long> sectorDistribution = new HashMap<>();
                Map<String, Long> sousSecteurDistribution = new HashMap<>();
                Map<String, Object> sectorPerformance = new HashMap<>();
                Map<String, Object> sectorTrends = new HashMap<>();
                
                // First, initialize all sectors with 0 count
                for (Map<String, Object> secteur : secteurs) {
                    String secteurName = (String) secteur.get("nom");
                    if (secteurName != null) {
                        sectorDistribution.put(secteurName, 0L);
                        System.out.println("Initialized sector: " + secteurName);
                    }
                }
                
                // Initialize all sub-sectors with 0 count
                for (Map<String, Object> sousSecteur : sousSecteurs) {
                    String sousSecteurName = (String) sousSecteur.get("nom");
                    if (sousSecteurName != null) {
                        sousSecteurDistribution.put(sousSecteurName, 0L);
                        System.out.println("Initialized sous-secteur: " + sousSecteurName);
                    }
                }
                
                // Process each entity's business data
                int processedEntities = 0;
                for (Map<String, Object> entity : entities) {
                    if (entity.containsKey("entiteBusiness")) {
                        Map<String, Object> business = (Map<String, Object>) entity.get("entiteBusiness");
                        System.out.println("Processing entity business data: " + business);
                        
                        // Get sector name directly from business data
                        String secteurName = (String) business.get("secteur");
                        if (secteurName != null) {
                            System.out.println("Found secteur: " + secteurName);
                            sectorDistribution.merge(secteurName, 1L, Long::sum);
                            System.out.println("Added entity to sector: " + secteurName);
                        } else {
                            System.out.println("No secteur found for entity");
                        }
                        
                        // Get sub-sector name directly from business data
                        String sousSecteurName = (String) business.get("sousSecteur");
                        if (sousSecteurName != null) {
                            System.out.println("Found sous-secteur: " + sousSecteurName);
                            sousSecteurDistribution.merge(sousSecteurName, 1L, Long::sum);
                            System.out.println("Added entity to sous-secteur: " + sousSecteurName);
                        } else {
                            System.out.println("No sous-secteur found for entity");
                        }
                        processedEntities++;
                    } else {
                        System.out.println("Entity has no business data: " + entity);
                    }
                }
                
                System.out.println("Processed " + processedEntities + " entities with business data");
                System.out.println("Final sector distribution: " + sectorDistribution);
                System.out.println("Final sous-secteur distribution: " + sousSecteurDistribution);
                
                // Calculate sector performance metrics
                for (String secteur : sectorDistribution.keySet()) {
                    Map<String, Object> metrics = new HashMap<>();
                    metrics.put("count", sectorDistribution.get(secteur));
                    metrics.put("percentage", (double) sectorDistribution.get(secteur) / entities.size() * 100);
                    sectorPerformance.put(secteur, metrics);
                }
                
                // Calculate trends
                for (String secteur : sectorDistribution.keySet()) {
                    Map<String, Object> trend = new HashMap<>();
                    trend.put("total", sectorDistribution.get(secteur));
                    trend.put("growth", calculateSectorGrowth(entities, secteur));
                    sectorTrends.put(secteur, trend);
                }
                
                // Build the response
                result.put("secteurs", sectorDistribution);
                result.put("sousSecteurs", sousSecteurDistribution);
                result.put("performance", sectorPerformance);
                result.put("trends", sectorTrends);
                
                System.out.println("Final sector analysis result: " + result);
            } else {
                System.out.println("Missing data - entiteData: " + (entiteData != null) + 
                                 ", secteursData: " + (secteursData != null) + 
                                 ", sousSecteursData: " + (sousSecteursData != null));
            }
        } catch (Exception e) {
            System.out.println("Error processing sector analysis: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Ensure we always return all required fields, even if empty
        if (!result.containsKey("secteurs")) result.put("secteurs", new HashMap<>());
        if (!result.containsKey("sousSecteurs")) result.put("sousSecteurs", new HashMap<>());
        if (!result.containsKey("performance")) result.put("performance", new HashMap<>());
        if (!result.containsKey("trends")) result.put("trends", new HashMap<>());
        
        return result;
    }

    private double calculateSectorGrowth(List<Map<String, Object>> entities, String secteur) {
        // Count entities in this sector created in the last 30 days
        long recentCount = entities.stream()
            .filter(e -> {
                if (e.containsKey("entiteBusiness")) {
                    Map<String, Object> business = (Map<String, Object>) e.get("entiteBusiness");
                    String entitySecteur = (String) business.get("secteur");
                    return secteur.equals(entitySecteur) && 
                           isRecentEntity(e.get("createdAt"));
                }
                return false;
            })
            .count();
        
        // Calculate growth rate
        long totalInSector = entities.stream()
            .filter(e -> {
                if (e.containsKey("entiteBusiness")) {
                    Map<String, Object> business = (Map<String, Object>) e.get("entiteBusiness");
                    return secteur.equals(business.get("secteur"));
                }
                return false;
            })
            .count();
        
        return totalInSector > 0 ? (double) recentCount / totalInSector * 100 : 0.0;
    }

    private boolean isRecentEntity(Object createdAt) {
        if (createdAt == null) return false;
        
        try {
            LocalDateTime date;
            if (createdAt instanceof String) {
                String dateStr = (String) createdAt;
                try {
                    date = LocalDateTime.parse(dateStr);
                } catch (Exception e) {
                    date = OffsetDateTime.parse(dateStr, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                        .toLocalDateTime();
                }
            } else {
                return false;
            }
            
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            return date.isAfter(thirtyDaysAgo);
        } catch (Exception e) {
            return false;
        }
    }

    public Map<String, Object> getProductTimeSeries(String token, String interval) {
        Object produitsData = productClient.getAllProduits(token);
        List<Map<String, Object>> produits = (List<Map<String, Object>>) produitsData;
        Map<String, Integer> timeSeries = new LinkedHashMap<>();

        for (Map<String, Object> produit : produits) {
            String createdAt = (String) produit.get("created_at");
            if (createdAt == null) {
                createdAt = (String) produit.get("createdAt"); // try camelCase if snake_case not found
            }
            System.out.println("createdAt: " + createdAt);
            if (createdAt != null) {
                try {
                    java.time.LocalDateTime date;
                    try {
                        // Try ISO_LOCAL_DATE_TIME first
                        date = java.time.LocalDateTime.parse(createdAt);
                    } catch (Exception e1) {
                        try {
                            // Try ISO_OFFSET_DATE_TIME (handles the +00:00)
                            date = OffsetDateTime.parse(createdAt, DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime();
                        } catch (Exception e2) {
                            // Try your custom format as a last resort
                            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                            date = java.time.LocalDateTime.parse(createdAt, formatter);
                        }
                    }
                    System.out.println("Parsed date: " + date);
                    String key;
                    if ("monthly".equalsIgnoreCase(interval)) {
                        key = date.getYear() + "-" + String.format("%02d", date.getMonthValue());
                    } else if ("daily".equalsIgnoreCase(interval)) {
                        key = date.toLocalDate().toString();
                    } else {
                        key = date.getYear() + "-" + String.format("%02d", date.getMonthValue());
                    }
                    timeSeries.put(key, timeSeries.getOrDefault(key, 0) + 1);
                } catch (Exception e) {
                    System.out.println("Failed to parse date: " + createdAt);
                }
            }
        }
        System.out.println("Aggregated time series: " + timeSeries);
        Map<String, Object> response = new HashMap<>();
        response.put("timeSeriesData", timeSeries);
        return response;
    }
}


