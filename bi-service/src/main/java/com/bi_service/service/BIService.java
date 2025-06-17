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
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Set;
import java.util.Objects;
import java.util.stream.Collectors;
import java.time.temporal.TemporalAdjuster;
import java.time.temporal.TemporalAdjusters;
import java.time.DayOfWeek;
import java.util.TreeMap;

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
        Map<String, Object> timeSeriesData = new HashMap<>();
        List<Map<String, Object>> chartData = new ArrayList<>();

        try {
            System.out.println("Time Series Analysis: Fetching entities...");
            Object entiteData = entiteClient.getAllEntites(token);

            if (entiteData != null && entiteData instanceof List) {
                List<Map<String, Object>> entities = (List<Map<String, Object>>) entiteData;
                System.out.println("Time Series Analysis: " + entities.size() + " entities fetched.");
                if (!entities.isEmpty()) {
                    System.out.println("Time Series Analysis: First entity raw data: " + entities.get(0));
                }

                // Filter by date range if provided
                List<Map<String, Object>> filteredEntities = entities.stream()
                    .filter(entity -> {
                        // Log for debugging createdAt presence and value
                        if (!entity.containsKey("createdAt")) {
                            System.out.println("Time Series Analysis: Entity missing createdAt: " + entity.get("id"));
                            return false;
                        }
                        Object createdAtObj = entity.get("createdAt");
                        if (!(createdAtObj instanceof String)) {
                            System.out.println("Time Series Analysis: createdAt is not a String for entity " + entity.get("id") + ": " + createdAtObj);
                            return false;
                        }
                        String createdAtStr = (String) createdAtObj;
                        System.out.println("Time Series Analysis: Processing entity " + entity.get("id") + " createdAt: " + createdAtStr);

                        LocalDateTime entityCreatedAt = LocalDateTime.parse(createdAtStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                        if (request.getStartDate() != null) {
                            LocalDateTime startDate = LocalDateTime.parse(request.getStartDate(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                            if (entityCreatedAt.isBefore(startDate)) return false;
                        }
                        if (request.getEndDate() != null) {
                            LocalDateTime entityCreatedAtForEndDateCheck = LocalDateTime.parse(createdAtStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                            LocalDateTime endDate = LocalDateTime.parse(request.getEndDate(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                            if (entityCreatedAtForEndDateCheck.isAfter(endDate)) return false;
                        }
                        return true;
                    })
                    .collect(Collectors.toList());

                System.out.println("Time Series Analysis: " + filteredEntities.size() + " entities after date filtering.");

                // Aggregate data by interval
                Map<String, Long> aggregatedCounts = new TreeMap<>(); // TreeMap to keep dates sorted
                DateTimeFormatter formatter;
                TemporalAdjuster adjuster = null;

                switch (request.getInterval().toLowerCase()) {
                    case "daily":
                        formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                        break;
                    case "weekly":
                        formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // Start of week
                        adjuster = TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY);
                        break;
                    case "monthly":
                        formatter = DateTimeFormatter.ofPattern("yyyy-MM");
                        break;
                    case "quarterly":
                        formatter = DateTimeFormatter.ofPattern("yyyy-Q"); // Custom for quarter
                        break;
                    default:
                        formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                }

                for (Map<String, Object> entity : filteredEntities) {
                    if (entity.containsKey("createdAt")) {
                        LocalDateTime createdAt = LocalDateTime.parse((String) entity.get("createdAt"), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                        String key;

                        if ("quarterly".equals(request.getInterval().toLowerCase())) {
                            int quarter = (createdAt.getMonthValue() - 1) / 3 + 1;
                            key = createdAt.getYear() + "-Q" + quarter;
                        } else if ("weekly".equals(request.getInterval().toLowerCase()) && adjuster != null) {
                            key = createdAt.with(adjuster).format(formatter);
                        } else {
                            key = createdAt.format(formatter);
                        }
                        aggregatedCounts.merge(key, 1L, Long::sum);
                    }
                }

                // Prepare data for chart
                for (Map.Entry<String, Long> entry : aggregatedCounts.entrySet()) {
                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("date", entry.getKey());
                    dataPoint.put("value", entry.getValue());
                    chartData.add(dataPoint);
                }
                System.out.println("Time Series Analysis: Chart data prepared: " + chartData.size() + " data points.");
            }
        } catch (Exception e) {
            System.err.println("Error in getTimeSeriesAnalysis: " + e.getMessage());
            e.printStackTrace();
            timeSeriesData.put("error", "Failed to generate time series: " + e.getMessage());
        }

        timeSeriesData.put("timeSeriesData", chartData);
        timeSeriesData.put("movingAverages", new HashMap<>()); // Placeholder
        timeSeriesData.put("forecasts", new HashMap<>());    // Placeholder

        return timeSeriesData;
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

    // Enhanced correlation analysis for business insights
    public Map<String, Object> getBusinessCorrelations(String token) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Object entiteData = entiteClient.getAllEntites(token);
            if (entiteData != null) {
                List<Map<String, Object>> entities = (List<Map<String, Object>>) entiteData;
                
                // Business Performance Correlations
                Map<String, Object> businessCorrelations = analyzeBusinessCorrelations(entities);
                result.put("businessCorrelations", businessCorrelations);
                
                // Sector Performance Correlations
                Map<String, Object> sectorCorrelations = analyzeSectorCorrelations(entities);
                result.put("sectorCorrelations", sectorCorrelations);
                
                // Geographic Correlations
                Map<String, Object> geographicCorrelations = analyzeGeographicCorrelations(entities);
                result.put("geographicCorrelations", geographicCorrelations);
                
                // Risk Analysis Correlations
                Map<String, Object> riskCorrelations = analyzeRiskCorrelations(entities);
                result.put("riskCorrelations", riskCorrelations);
                
                // Summary insights
                Map<String, Object> insights = generateCorrelationInsights(businessCorrelations, sectorCorrelations, geographicCorrelations, riskCorrelations);
                result.put("insights", insights);
            }
        } catch (Exception e) {
            System.out.println("Error calculating business correlations: " + e.getMessage());
        }
        
        return result;
    }

    // Business Intelligence Scorecard
    public Map<String, Object> getBusinessScorecard(String token) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            System.out.println("=== Starting Business Scorecard Generation ===");
            System.out.println("Token received: " + (token != null ? "Yes" : "No"));
            
            // Get data from services
            System.out.println("Calling entite service...");
            Object entiteData = entiteClient.getAllEntites(token);
            System.out.println("Entite data received: " + (entiteData != null));
            
            System.out.println("Calling parametrage service for type entreprises...");
            Object typeEntreprisesData = parametrageClient.getAllTypeEntreprises(token);
            System.out.println("Type entreprises data received: " + (typeEntreprisesData != null));
            
            System.out.println("Calling parametrage service for secteurs...");
            Object secteursData = parametrageClient.getAllSecteurs(token);
            System.out.println("Secteurs data received: " + (secteursData != null));
            
            if (entiteData != null) {
                List<Map<String, Object>> entities = (List<Map<String, Object>>) entiteData;
                System.out.println("Number of entities: " + entities.size());
                
                if (entities.isEmpty()) {
                    System.out.println("No entities found in the data");
                    result.put("error", "No entities found in the system");
                    return result;
                }
                
                // Log first entity structure for debugging
                if (!entities.isEmpty()) {
                    Map<String, Object> firstEntity = entities.get(0);
                    System.out.println("First entity keys: " + firstEntity.keySet());
                    System.out.println("First entity has entiteBusiness: " + firstEntity.containsKey("entiteBusiness"));
                    System.out.println("First entity has entiteContact: " + firstEntity.containsKey("entiteContact"));
                    System.out.println("First entity has region: " + firstEntity.containsKey("region"));
                    System.out.println("First entity has risk: " + firstEntity.containsKey("risk"));
                }
                
                // KPI Dashboard - Only calculate what we can actually get
                System.out.println("Calculating KPIs...");
                Map<String, Object> kpis = calculateBasicKPIs(entities);
                result.put("kpis", kpis);
                System.out.println("KPIs calculated: " + kpis.keySet());
                
                // Performance Rankings - Based on available data
                System.out.println("Generating rankings...");
                Map<String, Object> rankings = generateBasicRankings(entities);
                result.put("rankings", rankings);
                System.out.println("Rankings generated: " + rankings.keySet());
                
                // Action Items - Simplified based on actual data
                System.out.println("Generating action items...");
                Map<String, Object> actionItems = generateBasicActionItems(entities);
                result.put("actionItems", actionItems);
                System.out.println("Action items generated: " + actionItems.keySet());
                
                // Scorecard Summary
                System.out.println("Generating summary...");
                Map<String, Object> summary = generateBasicSummary(kpis, rankings, actionItems);
                result.put("summary", summary);
                System.out.println("Summary generated: " + summary.keySet());
                
                System.out.println("Scorecard generated successfully with " + result.size() + " sections");
            } else {
                System.out.println("No entite data available");
                result.put("error", "No entity data available");
            }
        } catch (Exception e) {
            System.out.println("Error generating business scorecard: " + e.getMessage());
            e.printStackTrace();
            result.put("error", "Error generating scorecard: " + e.getMessage());
        }
        
        return result;
    }

    // Simplified KPI calculation based on available data
    private Map<String, Object> calculateBasicKPIs(List<Map<String, Object>> entities) {
        Map<String, Object> kpis = new HashMap<>();
        
        long totalEntities = entities.size();
        kpis.put("totalEntities", totalEntities);
        
        // Calculate entities with business data
        long entitiesWithBusiness = entities.stream()
            .filter(e -> e.containsKey("entiteBusiness") && e.get("entiteBusiness") != null)
            .count();
        kpis.put("entitiesWithBusiness", entitiesWithBusiness);
        kpis.put("businessDataCompleteness", totalEntities > 0 ? (double) entitiesWithBusiness / totalEntities * 100 : 0);
        
        // Calculate entities with contact data
        long entitiesWithContact = entities.stream()
            .filter(e -> e.containsKey("entiteContact") && e.get("entiteContact") != null)
            .count();
        kpis.put("entitiesWithContact", entitiesWithContact);
        kpis.put("contactDataCompleteness", totalEntities > 0 ? (double) entitiesWithContact / totalEntities * 100 : 0);
        
        // Calculate entities with products data
        long entitiesWithProducts = entities.stream()
            .filter(e -> e.containsKey("entiteProducts") && e.get("entiteProducts") != null)
            .count();
        kpis.put("entitiesWithProducts", entitiesWithProducts);
        kpis.put("productsDataCompleteness", totalEntities > 0 ? (double) entitiesWithProducts / totalEntities * 100 : 0);
        
        // Calculate sector diversity
        Set<String> sectors = new HashSet<>();
        for (Map<String, Object> entity : entities) {
            if (entity.containsKey("entiteBusiness")) {
                Map<String, Object> business = (Map<String, Object>) entity.get("entiteBusiness");
                if (business != null && business.containsKey("secteur")) {
                    String secteur = (String) business.get("secteur");
                    if (secteur != null && !secteur.trim().isEmpty()) {
                        sectors.add(secteur);
                    }
                }
            }
        }
        kpis.put("sectorDiversity", sectors.size());
        kpis.put("sectors", new ArrayList<>(sectors));
        
        // Calculate regional diversity
        Set<String> regions = new HashSet<>();
        for (Map<String, Object> entity : entities) {
            String region = (String) entity.get("region");
            if (region != null && !region.trim().isEmpty()) {
                regions.add(region);
            }
        }
        kpis.put("regionalDiversity", regions.size());
        kpis.put("regions", new ArrayList<>(regions));
        
        // Calculate risk distribution (if available)
        Map<String, Long> riskDistribution = new HashMap<>();
        for (Map<String, Object> entity : entities) {
            Integer risk = (Integer) entity.get("risk");
            if (risk != null) {
                String riskLevel = risk <= 2 ? "Low" : risk <= 4 ? "Medium" : "High";
                riskDistribution.merge(riskLevel, 1L, Long::sum);
            }
        }
        kpis.put("riskDistribution", riskDistribution);
        
        // Calculate average risk
        double avgRisk = entities.stream()
            .mapToDouble(e -> {
                Integer risk = (Integer) e.get("risk");
                return risk != null ? risk : 0.0;
            })
            .average()
            .orElse(0.0);
        kpis.put("averageRisk", avgRisk);
        
        // KPI Status indicators
        kpis.put("businessDataStatus", getKPIStatus((Double) kpis.get("businessDataCompleteness"), 80.0, 60.0));
        kpis.put("contactDataStatus", getKPIStatus((Double) kpis.get("contactDataCompleteness"), 80.0, 60.0));
        kpis.put("sectorDiversityStatus", getKPIStatus((Integer) kpis.get("sectorDiversity"), 5, 3));
        kpis.put("regionalDiversityStatus", getKPIStatus((Integer) kpis.get("regionalDiversity"), 5, 3));
        
        return kpis;
    }

    private Map<String, Object> generateBasicRankings(List<Map<String, Object>> entities) {
        Map<String, Object> rankings = new HashMap<>();
        
        // Top sectors by entity count
        Map<String, Long> sectorCounts = new HashMap<>();
        for (Map<String, Object> entity : entities) {
            if (entity.containsKey("entiteBusiness")) {
                Map<String, Object> business = (Map<String, Object>) entity.get("entiteBusiness");
                if (business != null && business.containsKey("secteur")) {
                    String secteur = (String) business.get("secteur");
                    if (secteur != null && !secteur.trim().isEmpty()) {
                        sectorCounts.merge(secteur, 1L, Long::sum);
                    }
                }
            }
        }
        
        List<Map<String, Object>> topSectors = sectorCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(5)
            .map(entry -> {
                Map<String, Object> sector = new HashMap<>();
                sector.put("name", entry.getKey());
                sector.put("count", entry.getValue());
                sector.put("percentage", (double) entry.getValue() / entities.size() * 100);
                return sector;
            })
            .collect(Collectors.toList());
        
        // Top regions by entity count
        Map<String, Long> regionCounts = new HashMap<>();
        for (Map<String, Object> entity : entities) {
            String region = (String) entity.get("region");
            if (region != null && !region.trim().isEmpty()) {
                regionCounts.merge(region, 1L, Long::sum);
            }
        }
        
        List<Map<String, Object>> topRegions = regionCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(5)
            .map(entry -> {
                Map<String, Object> region = new HashMap<>();
                region.put("name", entry.getKey());
                region.put("count", entry.getValue());
                region.put("percentage", (double) entry.getValue() / entities.size() * 100);
                return region;
            })
            .collect(Collectors.toList());
        
        rankings.put("topSectors", topSectors);
        rankings.put("topRegions", topRegions);
        
        return rankings;
    }

    private Map<String, Object> generateBasicActionItems(List<Map<String, Object>> entities) {
        Map<String, Object> actionItems = new HashMap<>();
        List<Map<String, Object>> highPriority = new ArrayList<>();
        List<Map<String, Object>> mediumPriority = new ArrayList<>();
        List<Map<String, Object>> lowPriority = new ArrayList<>();
        
        // Calculate metrics for action items
        double businessDataCompleteness = entities.stream()
            .filter(e -> e.containsKey("entiteBusiness") && e.get("entiteBusiness") != null)
            .count() * 100.0 / entities.size();
        
        double contactDataCompleteness = entities.stream()
            .filter(e -> e.containsKey("entiteContact") && e.get("entiteContact") != null)
            .count() * 100.0 / entities.size();
        
        int sectorDiversity = (int) entities.stream()
            .filter(e -> e.containsKey("entiteBusiness"))
            .map(e -> {
                Map<String, Object> business = (Map<String, Object>) e.get("entiteBusiness");
                return business != null ? business.get("secteur") : null;
            })
            .filter(Objects::nonNull)
            .distinct()
            .count();
        
        // High Priority Actions
        if (businessDataCompleteness < 80.0) {
            Map<String, Object> action = new HashMap<>();
            action.put("title", "Improve Business Data Completeness");
            action.put("description", "Current completeness: " + String.format("%.1f", businessDataCompleteness) + "%. Target: 80%+");
            action.put("priority", "High");
            action.put("impact", "High");
            action.put("effort", "Medium");
            action.put("timeline", "30 days");
            highPriority.add(action);
        }
        
        if (contactDataCompleteness < 80.0) {
            Map<String, Object> action = new HashMap<>();
            action.put("title", "Improve Contact Data Completeness");
            action.put("description", "Current completeness: " + String.format("%.1f", contactDataCompleteness) + "%. Target: 80%+");
            action.put("priority", "High");
            action.put("impact", "High");
            action.put("effort", "Medium");
            action.put("timeline", "30 days");
            highPriority.add(action);
        }
        
        // Medium Priority Actions
        if (sectorDiversity < 5) {
            Map<String, Object> action = new HashMap<>();
            action.put("title", "Increase Sector Diversity");
            action.put("description", "Current diversity: " + sectorDiversity + " sectors. Target: 5+ sectors");
            action.put("priority", "Medium");
            action.put("impact", "Medium");
            action.put("effort", "High");
            action.put("timeline", "60 days");
            mediumPriority.add(action);
        }
        
        // Low Priority Actions
        Map<String, Object> action = new HashMap<>();
        action.put("title", "Regular Data Quality Review");
        action.put("description", "Schedule monthly data quality assessment");
        action.put("priority", "Low");
        action.put("impact", "Medium");
        action.put("effort", "Low");
        action.put("timeline", "Ongoing");
        lowPriority.add(action);
        
        actionItems.put("highPriority", highPriority);
        actionItems.put("mediumPriority", mediumPriority);
        actionItems.put("lowPriority", lowPriority);
        actionItems.put("totalActions", highPriority.size() + mediumPriority.size() + lowPriority.size());
        
        return actionItems;
    }

    private Map<String, Object> generateBasicSummary(Map<String, Object> kpis, Map<String, Object> rankings, Map<String, Object> actionItems) {
        Map<String, Object> summary = new HashMap<>();
        
        // Calculate overall score based on available metrics
        double overallScore = calculateBasicOverallScore(kpis);
        summary.put("overallScore", overallScore);
        summary.put("scoreGrade", getScoreGrade(overallScore));
        summary.put("lastUpdated", LocalDateTime.now().toString());
        
        // Key highlights
        List<String> highlights = new ArrayList<>();
        highlights.add("Total Entities: " + kpis.get("totalEntities"));
        highlights.add("Business Data Completeness: " + String.format("%.1f", (Double) kpis.get("businessDataCompleteness")) + "%");
        highlights.add("Sector Diversity: " + kpis.get("sectorDiversity") + " sectors");
        highlights.add("Regional Diversity: " + kpis.get("regionalDiversity") + " regions");
        
        summary.put("highlights", highlights);
        
        // Performance summary
        Map<String, Object> performance = new HashMap<>();
        performance.put("strengths", identifyBasicStrengths(kpis));
        performance.put("weaknesses", identifyBasicWeaknesses(kpis));
        performance.put("opportunities", identifyBasicOpportunities(rankings, actionItems));
        
        summary.put("performance", performance);
        
        return summary;
    }

    private double calculateBasicOverallScore(Map<String, Object> kpis) {
        // Weighted score calculation based on available metrics
        double businessDataScore = (Double) kpis.get("businessDataCompleteness") * 0.3;
        double contactDataScore = (Double) kpis.get("contactDataCompleteness") * 0.2;
        double sectorDiversityScore = Math.min((Integer) kpis.get("sectorDiversity") * 5, 25) * 0.2;
        double regionalDiversityScore = Math.min((Integer) kpis.get("regionalDiversity") * 5, 25) * 0.2;
        double riskScore = Math.max(0, (5 - (Double) kpis.get("averageRisk")) * 5) * 0.1;
        
        return businessDataScore + contactDataScore + sectorDiversityScore + regionalDiversityScore + riskScore;
    }

    private List<String> identifyBasicStrengths(Map<String, Object> kpis) {
        List<String> strengths = new ArrayList<>();
        
        if ((Double) kpis.get("businessDataCompleteness") >= 80.0) {
            strengths.add("High business data completeness indicates good data quality");
        }
        if ((Double) kpis.get("contactDataCompleteness") >= 80.0) {
            strengths.add("Good contact data completeness shows strong customer information");
        }
        if ((Integer) kpis.get("sectorDiversity") >= 5) {
            strengths.add("Good sector diversity shows balanced portfolio");
        }
        if ((Integer) kpis.get("regionalDiversity") >= 5) {
            strengths.add("Strong regional diversity indicates broad market presence");
        }
        
        return strengths;
    }

    private List<String> identifyBasicWeaknesses(Map<String, Object> kpis) {
        List<String> weaknesses = new ArrayList<>();
        
        if ((Double) kpis.get("businessDataCompleteness") < 80.0) {
            weaknesses.add("Low business data completeness needs improvement");
        }
        if ((Double) kpis.get("contactDataCompleteness") < 80.0) {
            weaknesses.add("Low contact data completeness restricts customer insights");
        }
        if ((Integer) kpis.get("sectorDiversity") < 5) {
            weaknesses.add("Limited sector diversity increases concentration risk");
        }
        if ((Integer) kpis.get("regionalDiversity") < 5) {
            weaknesses.add("Limited regional diversity restricts market reach");
        }
        
        return weaknesses;
    }

    private List<String> identifyBasicOpportunities(Map<String, Object> rankings, Map<String, Object> actionItems) {
        List<String> opportunities = new ArrayList<>();
        
        opportunities.add("Expand into underserved sectors based on diversity analysis");
        opportunities.add("Increase presence in regions with low coverage");
        opportunities.add("Improve data quality through systematic data collection");
        opportunities.add("Focus on completing missing business and contact information");
        
        return opportunities;
    }

    private String getKPIStatus(double value, double greenThreshold, double yellowThreshold) {
        if (value >= greenThreshold) return "Green";
        else if (value >= yellowThreshold) return "Yellow";
        else return "Red";
    }

    private String getScoreGrade(double score) {
        if (score >= 80) return "A";
        else if (score >= 70) return "B";
        else if (score >= 60) return "C";
        else if (score >= 50) return "D";
        else return "F";
    }

    private Map<String, Object> analyzeBusinessCorrelations(List<Map<String, Object>> entities) {
        Map<String, Object> correlations = new HashMap<>();
        
        // Extract business metrics
        List<Double> riskLevels = new ArrayList<>();
        List<Double> companyAges = new ArrayList<>();
        List<String> legalForms = new ArrayList<>();
        List<String> sectors = new ArrayList<>();
        List<String> regions = new ArrayList<>();
        
        for (Map<String, Object> entity : entities) {
            if (entity.containsKey("entiteBusiness")) {
                Map<String, Object> business = (Map<String, Object>) entity.get("entiteBusiness");
                
                // Risk level
                Object risk = business.get("risk");
                if (risk != null) {
                    riskLevels.add(((Number) risk).doubleValue());
                }
                
                // Company age (from creation date)
                String creationDate = (String) business.get("dateCreation");
                if (creationDate != null) {
                    try {
                        int age = calculateCompanyAge(creationDate);
                        companyAges.add((double) age);
                    } catch (Exception e) {
                        // Skip invalid dates
                    }
                }
                
                // Legal form
                String legalForm = (String) business.get("formeJuridique");
                if (legalForm != null) {
                    legalForms.add(legalForm);
                }
                
                // Sector
                String sector = (String) business.get("secteur");
                if (sector != null) {
                    sectors.add(sector);
                }
                
                // Region
                String region = (String) entity.get("region");
                if (region != null) {
                    regions.add(region);
                }
            }
        }
        
        // Calculate correlations
        if (riskLevels.size() > 1 && companyAges.size() > 1) {
            double riskAgeCorrelation = calculatePearsonCorrelation(riskLevels, companyAges);
            correlations.put("risk_vs_age", riskAgeCorrelation);
        }
        
        // Sector distribution analysis
        Map<String, Long> sectorDistribution = sectors.stream()
            .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
        correlations.put("sector_distribution", sectorDistribution);
        
        // Region distribution analysis
        Map<String, Long> regionDistribution = regions.stream()
            .collect(Collectors.groupingBy(r -> r, Collectors.counting()));
        correlations.put("region_distribution", regionDistribution);
        
        // Legal form distribution
        Map<String, Long> legalFormDistribution = legalForms.stream()
            .collect(Collectors.groupingBy(lf -> lf, Collectors.counting()));
        correlations.put("legal_form_distribution", legalFormDistribution);
        
        return correlations;
    }

    private Map<String, Object> analyzeSectorCorrelations(List<Map<String, Object>> entities) {
        Map<String, Object> correlations = new HashMap<>();
        
        // Group entities by sector and analyze performance metrics
        Map<String, List<Map<String, Object>>> sectorGroups = new HashMap<>();
        
        for (Map<String, Object> entity : entities) {
            if (entity.containsKey("entiteBusiness")) {
                Map<String, Object> business = (Map<String, Object>) entity.get("entiteBusiness");
                String sector = (String) business.get("secteur");
                if (sector != null) {
                    sectorGroups.computeIfAbsent(sector, k -> new ArrayList<>()).add(entity);
                }
            }
        }
        
        // Calculate sector performance metrics
        Map<String, Object> sectorPerformance = new HashMap<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : sectorGroups.entrySet()) {
            String sector = entry.getKey();
            List<Map<String, Object>> sectorEntities = entry.getValue();
            
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("entity_count", sectorEntities.size());
            metrics.put("average_risk", calculateAverageRisk(sectorEntities));
            metrics.put("average_age", calculateAverageAge(sectorEntities));
            
            sectorPerformance.put(sector, metrics);
        }
        
        correlations.put("sector_performance", sectorPerformance);
        return correlations;
    }

    private Map<String, Object> analyzeGeographicCorrelations(List<Map<String, Object>> entities) {
        Map<String, Object> correlations = new HashMap<>();
        
        // Group entities by region
        Map<String, List<Map<String, Object>>> regionGroups = new HashMap<>();
        
        for (Map<String, Object> entity : entities) {
            String region = (String) entity.get("region");
            if (region != null) {
                regionGroups.computeIfAbsent(region, k -> new ArrayList<>()).add(entity);
            }
        }
        
        // Calculate regional performance metrics
        Map<String, Object> regionalPerformance = new HashMap<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : regionGroups.entrySet()) {
            String region = entry.getKey();
            List<Map<String, Object>> regionEntities = entry.getValue();
            
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("entity_count", regionEntities.size());
            metrics.put("sector_diversity", calculateSectorDiversity(regionEntities));
            metrics.put("average_risk", calculateAverageRisk(regionEntities));
            
            regionalPerformance.put(region, metrics);
        }
        
        correlations.put("regional_performance", regionalPerformance);
        return correlations;
    }

    private Map<String, Object> analyzeRiskCorrelations(List<Map<String, Object>> entities) {
        Map<String, Object> correlations = new HashMap<>();
        
        // Risk level analysis
        Map<String, List<Map<String, Object>>> riskGroups = new HashMap<>();
        
        for (Map<String, Object> entity : entities) {
            if (entity.containsKey("entiteBusiness")) {
                Map<String, Object> business = (Map<String, Object>) entity.get("entiteBusiness");
                Object risk = business.get("risk");
                if (risk != null) {
                    String riskLevel = getRiskLevel(((Number) risk).intValue());
                    riskGroups.computeIfAbsent(riskLevel, k -> new ArrayList<>()).add(entity);
                }
            }
        }
        
        // Calculate risk-based metrics
        Map<String, Object> riskAnalysis = new HashMap<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : riskGroups.entrySet()) {
            String riskLevel = entry.getKey();
            List<Map<String, Object>> riskEntities = entry.getValue();
            
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("entity_count", riskEntities.size());
            metrics.put("sector_distribution", getSectorDistribution(riskEntities));
            metrics.put("average_age", calculateAverageAge(riskEntities));
            
            riskAnalysis.put(riskLevel, metrics);
        }
        
        correlations.put("risk_analysis", riskAnalysis);
        return correlations;
    }

    private Map<String, Object> generateCorrelationInsights(Map<String, Object> businessCorrelations, 
                                                           Map<String, Object> sectorCorrelations,
                                                           Map<String, Object> geographicCorrelations,
                                                           Map<String, Object> riskCorrelations) {
        Map<String, Object> insights = new HashMap<>();
        List<String> keyInsights = new ArrayList<>();
        
        // Generate insights based on correlation data
        if (businessCorrelations.containsKey("risk_vs_age")) {
            Double riskAgeCorr = (Double) businessCorrelations.get("risk_vs_age");
            if (Math.abs(riskAgeCorr) > 0.3) {
                String insight = riskAgeCorr > 0 ? 
                    "Older companies tend to have higher risk levels" :
                    "Newer companies tend to have higher risk levels";
                keyInsights.add(insight);
            }
        }
        
        // Sector insights
        if (sectorCorrelations.containsKey("sector_performance")) {
            Map<String, Object> sectorPerf = (Map<String, Object>) sectorCorrelations.get("sector_performance");
            String topSector = findTopPerformingSector(sectorPerf);
            if (topSector != null) {
                keyInsights.add("Sector '" + topSector + "' shows the best performance metrics");
            }
        }
        
        // Regional insights
        if (geographicCorrelations.containsKey("regional_performance")) {
            Map<String, Object> regionalPerf = (Map<String, Object>) geographicCorrelations.get("regional_performance");
            String topRegion = findTopPerformingRegion(regionalPerf);
            if (topRegion != null) {
                keyInsights.add("Region '" + topRegion + "' has the highest business diversity");
            }
        }
        
        insights.put("key_insights", keyInsights);
        insights.put("total_insights", keyInsights.size());
        
        return insights;
    }

    // Helper methods
    private int calculateCompanyAge(String creationDate) {
        // Simple age calculation - can be enhanced with proper date parsing
        try {
            int year = Integer.parseInt(creationDate.substring(0, 4));
            return 2024 - year; // Assuming current year is 2024
        } catch (Exception e) {
            return 0;
        }
    }

    private double calculateAverageRisk(List<Map<String, Object>> entities) {
        return entities.stream()
            .filter(e -> e.containsKey("entiteBusiness"))
            .mapToDouble(e -> {
                Map<String, Object> business = (Map<String, Object>) e.get("entiteBusiness");
                Object risk = business.get("risk");
                return risk != null ? ((Number) risk).doubleValue() : 0.0;
            })
            .average()
            .orElse(0.0);
    }

    private double calculateAverageAge(List<Map<String, Object>> entities) {
        return entities.stream()
            .filter(e -> e.containsKey("entiteBusiness"))
            .mapToDouble(e -> {
                Map<String, Object> business = (Map<String, Object>) e.get("entiteBusiness");
                String creationDate = (String) business.get("dateCreation");
                return creationDate != null ? calculateCompanyAge(creationDate) : 0.0;
            })
            .average()
            .orElse(0.0);
    }

    private int calculateSectorDiversity(List<Map<String, Object>> entities) {
        Set<String> sectors = entities.stream()
            .filter(e -> e.containsKey("entiteBusiness"))
            .map(e -> {
                Map<String, Object> business = (Map<String, Object>) e.get("entiteBusiness");
                return (String) business.get("secteur");
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
        return sectors.size();
    }

    private String getRiskLevel(int riskValue) {
        if (riskValue <= 2) return "Low";
        else if (riskValue <= 4) return "Medium";
        else return "High";
    }

    private Map<String, Long> getSectorDistribution(List<Map<String, Object>> entities) {
        return entities.stream()
            .filter(e -> e.containsKey("entiteBusiness"))
            .map(e -> {
                Map<String, Object> business = (Map<String, Object>) e.get("entiteBusiness");
                return (String) business.get("secteur");
            })
            .filter(Objects::nonNull)
            .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
    }

    private String findTopPerformingSector(Map<String, Object> sectorPerformance) {
        return sectorPerformance.entrySet().stream()
            .max((e1, e2) -> {
                Map<String, Object> metrics1 = (Map<String, Object>) e1.getValue();
                Map<String, Object> metrics2 = (Map<String, Object>) e2.getValue();
                Long count1 = (Long) metrics1.get("entity_count");
                Long count2 = (Long) metrics2.get("entity_count");
                return count1.compareTo(count2);
            })
            .map(Map.Entry::getKey)
            .orElse(null);
    }

    private String findTopPerformingRegion(Map<String, Object> regionalPerformance) {
        return regionalPerformance.entrySet().stream()
            .max((e1, e2) -> {
                Map<String, Object> metrics1 = (Map<String, Object>) e1.getValue();
                Map<String, Object> metrics2 = (Map<String, Object>) e2.getValue();
                Integer diversity1 = (Integer) metrics1.get("sector_diversity");
                Integer diversity2 = (Integer) metrics2.get("sector_diversity");
                return diversity1.compareTo(diversity2);
            })
            .map(Map.Entry::getKey)
            .orElse(null);
    }

    private int calculateRegionalCoverage(List<Map<String, Object>> entities) {
        Set<String> regions = entities.stream()
            .map(e -> (String) e.get("region"))
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
        return regions.size();
    }
}


