import client from '../api/axiosClient';

class BIService {
    async getAggregatedMetrics(timeframe = 'monthly', dimensions = []) {
        try {
            console.log('Calling getAggregatedMetrics with:', { timeframe, dimensions });
            const response = await client.post('/api/bi/aggregate', {
                timeframe,
                dimensions,
                metrics: ['sales', 'revenue', 'profit', 'growth'],
                filters: this.buildFilters(dimensions)
            });
            console.log('Aggregated metrics response:', response.data);
            return this.processAggregatedData(response.data);
        } catch (error) {
            console.error('Error in getAggregatedMetrics:', error);
            throw error;
        }
    }

    async getTimeSeriesAnalysis(metric, interval, startDate, endDate) {
        try {
            console.log('Calling getTimeSeriesAnalysis with:', { metric, interval, startDate, endDate });
            const response = await client.get('/api/bi/timeseries', {
                params: {
                    metric,
                    interval,
                    startDate,
                    endDate,
                    includeForecast: true
                }
            });
            console.log('Time series response:', response.data);
            return this.processTimeSeriesData(response.data);
        } catch (error) {
            console.error('Error in getTimeSeriesAnalysis:', error);
            throw error;
        }
    }

    async getEntityAnalytics() {
        try {
            console.log('Calling getEntityAnalytics');
            const [entitesResponse, typeEntreprisesResponse] = await Promise.all([
                client.get('/api/entites'),
                client.get('/api/type-entreprises')
            ]);

            console.log('Entity analytics responses:', {
                entites: entitesResponse.data,
                typeEntreprises: typeEntreprisesResponse.data
            });

            // Create a map of type entreprise IDs to their names
            const typeEntrepriseMap = new Map(
                typeEntreprisesResponse.data.map(type => [type.id, type.nom])
            );

            // Process the data
            const distribution = {};
            const performance = {};
            let totalEntities = 0;
            let totalTypes = new Set();

            // Process each entity
            entitesResponse.data.forEach(entity => {
                if (entity.typeEntrepriseId) {
                    const typeName = typeEntrepriseMap.get(entity.typeEntrepriseId) || 'Unknown';
                    distribution[typeName] = (distribution[typeName] || 0) + 1;
                    totalTypes.add(typeName);
                    totalEntities++;
                }
            });

            // Calculate performance metrics
            Object.entries(distribution).forEach(([type, count]) => {
                performance[type] = {
                    count,
                    percentage: (count / totalEntities) * 100,
                    details: {
                        type: type,
                        status: 'Active' // You might want to get this from the type entreprise data
                    }
                };
            });

            console.log('Processed entity data:', {
                entityDistribution: distribution,
                performance,
                totalEntities,
                totalTypes: totalTypes.size
            });

            return {
                entityDistribution: distribution,
                performance,
                totalEntities,
                totalTypes: totalTypes.size
            };
        } catch (error) {
            console.error('Error in getEntityAnalytics:', error);
            throw error;
        }
    }

    async getSectorAnalysis() {
        try {
            console.log('Calling getSectorAnalysis');
            const [entitesResponse, secteursResponse, sousSecteursResponse] = await Promise.all([
                client.get('/api/entites'),
                client.get('/api/secteurs'),
                client.get('/api/sous-secteurs')
            ]);

            console.log('Sector analysis responses:', {
                entites: entitesResponse.data,
                secteurs: secteursResponse.data,
                sousSecteurs: sousSecteursResponse.data
            });

            // Create maps for efficient lookup
            const secteurMap = new Map(
                secteursResponse.data.map(secteur => [secteur.id, secteur.nom])
            );
            const sousSecteurMap = new Map(
                sousSecteursResponse.data.map(sousSecteur => [sousSecteur.id, sousSecteur.nom])
            );

            // Initialize distribution maps
            const secteurs = {};
            const sousSecteurs = {};
            const performance = {};
            const trends = {};

            // Initialize all sectors and sous-secteurs with 0 count
            secteursResponse.data.forEach(secteur => {
                if (secteur.nom) {
                    secteurs[secteur.nom] = 0;
                }
            });

            sousSecteursResponse.data.forEach(sousSecteur => {
                if (sousSecteur.nom) {
                    sousSecteurs[sousSecteur.nom] = 0;
                }
            });

            // Process each entity's business data
            let totalEntities = 0;
            entitesResponse.data.forEach(entity => {
                if (entity.entiteBusiness) {
                    const business = entity.entiteBusiness;
                    
                    // Process secteur
                    if (business.secteur) {
                        secteurs[business.secteur] = (secteurs[business.secteur] || 0) + 1;
                        totalEntities++;
                    }

                    // Process sous-secteur
                    if (business.sousSecteur) {
                        sousSecteurs[business.sousSecteur] = (sousSecteurs[business.sousSecteur] || 0) + 1;
                    }
                }
            });

            // Calculate performance metrics
            Object.entries(secteurs).forEach(([secteur, count]) => {
                if (count > 0) {
                    performance[secteur] = {
                        count,
                        percentage: (count / totalEntities) * 100
                    };
                }
            });

            // Calculate trends (simple growth rate based on creation date)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            Object.entries(secteurs).forEach(([secteur, totalCount]) => {
                if (totalCount > 0) {
                    const recentCount = entitesResponse.data.filter(entity => {
                        if (!entity.entiteBusiness || !entity.entiteBusiness.secteur) return false;
                        if (entity.entiteBusiness.secteur !== secteur) return false;
                        
                        const createdAt = new Date(entity.createdAt);
                        return createdAt >= thirtyDaysAgo;
                    }).length;

                    trends[secteur] = {
                        total: totalCount,
                        recent: recentCount,
                        growth: totalCount > 0 ? (recentCount / totalCount) * 100 : 0
                    };
                }
            });

            console.log('Processed sector data:', {
                secteurs,
                sousSecteurs,
                performance,
                trends
            });

            return {
                secteurs,
                sousSecteurs,
                performance,
                trends
            };
        } catch (error) {
            console.error('Error in getSectorAnalysis:', error);
            throw error;
        }
    }

    async getProductTimeSeries(interval = 'monthly') {
        const response = await client.get('/api/bi/timeseries/products', { params: { interval } });
        return response.data;
    }

    // Data processing methods
    processAggregatedData(data) {
        return {
            ...data,
            trends: this.calculateTrends(data),
            anomalies: this.detectAnomalies(data),
            correlations: this.findCorrelations(data)
        };
    }

    processTimeSeriesData(data) {
        if (!data || typeof data !== 'object') {
            return {
                timeSeriesData: {},
                movingAverages: {},
                forecasts: {}
            };
        }

        const timeSeriesData = data.timeSeriesData || {};
        const movingAverages = this.calculateMovingAverages(timeSeriesData);
        const forecasts = this.generateForecasts(timeSeriesData);

        return {
            timeSeriesData,
            movingAverages,
            forecasts
        };
    }

    processSectorData(data) {
        console.log('Processing sector data:', data);
        if (!data) {
            console.log('No sector data available');
            return {
                secteurs: {},
                sousSecteurs: {},
                performance: {},
                trends: {}
            };
        }

        // If the data is already in the correct format from the backend, return it directly
        if (data.secteurs && data.sousSecteurs) {
            console.log('Data already in correct format:', data);
            return {
                secteurs: data.secteurs,
                sousSecteurs: data.sousSecteurs,
                performance: data.performance || {},
                trends: data.trends || {}
            };
        }

        // Otherwise, process the raw data
        const secteurs = {};
        const sousSecteurs = {};
        const performance = {};
        const trends = {};

        if (Array.isArray(data)) {
            data.forEach(item => {
                if (item.secteur) {
                    secteurs[item.secteur] = (secteurs[item.secteur] || 0) + 1;
                }
                if (item.sousSecteur) {
                    sousSecteurs[item.sousSecteur] = (sousSecteurs[item.sousSecteur] || 0) + 1;
                }
            });
        }

        // Calculate performance metrics
        const totalEntities = Object.values(secteurs).reduce((sum, count) => sum + count, 0);
        Object.entries(secteurs).forEach(([secteur, count]) => {
            performance[secteur] = {
                count,
                percentage: (count / totalEntities) * 100
            };
        });

        console.log('Processed sector data:', {
            secteurs,
            sousSecteurs,
            performance,
            trends
        });

        return {
            secteurs,
            sousSecteurs,
            performance,
            trends
        };
    }

    // Helper methods
    buildFilters(dimensions) {
        return dimensions.reduce((filters, dim) => ({
            ...filters,
            [dim]: { active: true }
        }), {});
    }

    calculateTrends(data) {
        if (!data || typeof data !== 'object') {
            return {
                trends: {},
                seasonality: {},
                correlations: {}
            };
        }

        const trends = {};
        const seasonality = {};
        const correlations = {};

        Object.entries(data).forEach(([key, values]) => {
            if (Array.isArray(values) && values.length > 0) {
                // Calculate trend
                const trend = this.calculateLinearTrend(values);
                trends[key] = trend;

                // Detect seasonality
                const seasonal = this.detectSeasonality(values);
                seasonality[key] = seasonal;

                // Calculate correlations with other metrics
                Object.entries(data).forEach(([otherKey, otherValues]) => {
                    if (key !== otherKey && Array.isArray(otherValues) && otherValues.length === values.length) {
                        const correlation = this.calculateCorrelation(values, otherValues);
                        if (!correlations[key]) {
                            correlations[key] = {};
                        }
                        correlations[key][otherKey] = correlation;
                    }
                });
            }
        });

        return { trends, seasonality, correlations };
    }

    detectAnomalies(data) {
        if (!data || typeof data !== 'object') {
            return {
                anomalies: {},
                outliers: {},
                patterns: {}
            };
        }

        const anomalies = {};
        const outliers = {};
        const patterns = {};

        Object.entries(data).forEach(([key, values]) => {
            if (Array.isArray(values) && values.length > 0) {
                // Find outliers using IQR method
                const outlierResult = this.findOutliers(values);
                outliers[key] = outlierResult;

                // Detect anomalies using moving average
                const anomalyResult = this.detectAnomaliesWithMovingAverage(values);
                anomalies[key] = anomalyResult;

                // Detect patterns
                const patternResult = this.detectPatterns(values);
                patterns[key] = patternResult;
            }
        });

        return { anomalies, outliers, patterns };
    }

    findCorrelations(data) {
        if (!data || typeof data !== 'object') {
            return {
                positive: {},
                negative: {},
                strong: {}
            };
        }

        const correlations = {};
        const metrics = Object.keys(data);

        // Calculate correlations between all pairs of metrics
        for (let i = 0; i < metrics.length; i++) {
            const metric1 = metrics[i];
            const values1 = data[metric1];
            
            if (!Array.isArray(values1)) continue;

            correlations[metric1] = {};
            
            for (let j = i + 1; j < metrics.length; j++) {
                const metric2 = metrics[j];
                const values2 = data[metric2];
                
                if (!Array.isArray(values2) || values1.length !== values2.length) continue;

                const correlation = this.calculateCorrelation(values1, values2);
                correlations[metric1][metric2] = correlation;
            }
        }

        // Find strong correlations (absolute value > 0.7)
        const strong = this.findStrongCorrelations(correlations);
        
        // Separate positive and negative correlations
        const { positive, negative } = this.separateCorrelations(correlations);

        return {
            positive,
            negative,
            strong
        };
    }

    findStrongCorrelations(correlations) {
        const strong = {};
        const threshold = 0.7;

        Object.entries(correlations).forEach(([metric1, metricCorrelations]) => {
            Object.entries(metricCorrelations).forEach(([metric2, value]) => {
                if (Math.abs(value) >= threshold) {
                    if (!strong[metric1]) {
                        strong[metric1] = {};
                    }
                    strong[metric1][metric2] = {
                        value,
                        type: value > 0 ? 'positive' : 'negative',
                        strength: Math.abs(value)
                    };
                }
            });
        });

        return strong;
    }

    separateCorrelations(correlations) {
        const positive = {};
        const negative = {};

        Object.entries(correlations).forEach(([metric1, metricCorrelations]) => {
            Object.entries(metricCorrelations).forEach(([metric2, value]) => {
                if (value > 0) {
                    if (!positive[metric1]) {
                        positive[metric1] = {};
                    }
                    positive[metric1][metric2] = value;
                } else if (value < 0) {
                    if (!negative[metric1]) {
                        negative[metric1] = {};
                    }
                    negative[metric1][metric2] = value;
                }
            });
        });

        return { positive, negative };
    }

    calculateMovingAverage(data, windowSize = 7) {
        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }

        const result = [];
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const window = data.slice(start, i + 1);
            const sum = window.reduce((acc, val) => acc + (val || 0), 0);
            result.push(sum / window.length);
        }
        return result;
    }

    calculateMovingAverages(data) {
        if (!data || typeof data !== 'object') {
            return {};
        }

        const result = {};
        Object.entries(data).forEach(([key, values]) => {
            if (Array.isArray(values)) {
                result[key] = this.calculateMovingAverage(values);
            }
        });
        return result;
    }

    detectSeasonality(data) {
        if (!Array.isArray(data) || data.length < 24) {
            return { hasSeasonality: false, period: null, strength: 0 };
        }

        const seasonality = this.calculateSeasonality(data);
        const threshold = 0.5; // Threshold for considering seasonality significant

        return {
            hasSeasonality: seasonality.strength > threshold,
            period: seasonality.period,
            strength: seasonality.strength
        };
    }

    calculateSeasonality(data) {
        if (!Array.isArray(data) || data.length < 24) {
            return { period: null, strength: 0 };
        }

        // Normalize the data
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        const normalizedData = data.map(x => x - mean);

        // Calculate autocorrelation for different periods
        const maxPeriod = Math.min(12, Math.floor(data.length / 2));
        const autocorrelations = [];

        for (let period = 1; period <= maxPeriod; period++) {
            let numerator = 0;
            let denominator = 0;

            for (let i = 0; i < data.length - period; i++) {
                numerator += normalizedData[i] * normalizedData[i + period];
                denominator += normalizedData[i] * normalizedData[i];
            }

            const autocorrelation = denominator !== 0 ? numerator / denominator : 0;
            autocorrelations.push({ period, value: autocorrelation });
        }

        // Find the period with the highest autocorrelation
        const maxAutocorr = autocorrelations.reduce((max, curr) => 
            curr.value > max.value ? curr : max, 
            { period: 1, value: 0 }
        );

        // Calculate seasonality strength (0 to 1)
        const strength = Math.abs(maxAutocorr.value);

        return {
            period: maxAutocorr.period,
            strength: strength
        };
    }

    generateForecasts(data) {
        if (!data || typeof data !== 'object') {
            return {};
        }

        const result = {};
        Object.entries(data).forEach(([key, values]) => {
            if (Array.isArray(values) && values.length > 0) {
                const lastValue = values[values.length - 1];
                const growthRate = this.calculateGrowthRate(values);
                const forecast = [];
                for (let i = 0; i < 12; i++) {
                    forecast.push(lastValue * (1 + (growthRate / 100) * (i + 1)));
                }
                result[key] = forecast;
            }
        });
        return result;
    }

    calculateGrowthRate(values) {
        if (!Array.isArray(values) || values.length < 2) {
            return 0;
        }

        const firstValue = values[0];
        const lastValue = values[values.length - 1];
        if (firstValue === 0) return 0;
        
        return ((lastValue - firstValue) / firstValue) * 100;
    }

    // Statistical methods
    findOutliers(values) {
        if (!Array.isArray(values) || values.length < 4) {
            return {
                outliers: [],
                threshold: { lower: 0, upper: 0 }
            };
        }

        // Sort the values
        const sortedValues = [...values].sort((a, b) => a - b);
        
        // Calculate quartiles
        const q1Index = Math.floor(sortedValues.length * 0.25);
        const q3Index = Math.floor(sortedValues.length * 0.75);
        
        const q1 = sortedValues[q1Index];
        const q3 = sortedValues[q3Index];
        
        // Calculate IQR
        const iqr = q3 - q1;
        
        // Calculate thresholds
        const lowerThreshold = q1 - 1.5 * iqr;
        const upperThreshold = q3 + 1.5 * iqr;
        
        // Find outliers
        const outliers = values.map((value, index) => ({
            value,
            index,
            isOutlier: value < lowerThreshold || value > upperThreshold
        })).filter(item => item.isOutlier);

        return {
            outliers,
            threshold: {
                lower: lowerThreshold,
                upper: upperThreshold
            }
        };
    }

    detectAnomaliesWithMovingAverage(values) {
        if (!Array.isArray(values) || values.length < 7) {
            return {
                anomalies: [],
                movingAverage: []
            };
        }

        // Calculate moving average
        const windowSize = 7;
        const movingAverage = this.calculateMovingAverage(values, windowSize);
        
        // Calculate standard deviation of differences
        const differences = values.map((value, i) => 
            i >= windowSize - 1 ? value - movingAverage[i] : null
        ).filter(diff => diff !== null);
        
        const meanDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
        const stdDev = Math.sqrt(
            differences.reduce((a, b) => a + Math.pow(b - meanDiff, 2), 0) / differences.length
        );
        
        // Detect anomalies (values more than 2 standard deviations from moving average)
        const threshold = 2 * stdDev;
        const anomalies = values.map((value, index) => {
            if (index < windowSize - 1) return null;
            
            const diff = Math.abs(value - movingAverage[index]);
            return {
                value,
                index,
                isAnomaly: diff > threshold,
                deviation: diff / stdDev
            };
        }).filter(item => item !== null && item.isAnomaly);

        return {
            anomalies,
            movingAverage
        };
    }

    detectPatterns(values) {
        if (!Array.isArray(values) || values.length < 4) {
            return {
                hasPattern: false,
                patternType: null,
                confidence: 0
            };
        }

        // Check for increasing trend
        const increasingCount = values.reduce((count, value, i) => 
            i > 0 && value > values[i - 1] ? count + 1 : count, 0);
        
        // Check for decreasing trend
        const decreasingCount = values.reduce((count, value, i) => 
            i > 0 && value < values[i - 1] ? count + 1 : count, 0);
        
        // Check for cyclic pattern
        const seasonality = this.detectSeasonality(values);
        
        const totalPoints = values.length - 1;
        const increasingRatio = increasingCount / totalPoints;
        const decreasingRatio = decreasingCount / totalPoints;
        
        let patternType = null;
        let confidence = 0;
        
        if (seasonality.hasSeasonality && seasonality.strength > 0.7) {
            patternType = 'cyclic';
            confidence = seasonality.strength;
        } else if (increasingRatio > 0.7) {
            patternType = 'increasing';
            confidence = increasingRatio;
        } else if (decreasingRatio > 0.7) {
            patternType = 'decreasing';
            confidence = decreasingRatio;
        }
        
        return {
            hasPattern: patternType !== null,
            patternType,
            confidence
        };
    }

    calculateLinearTrend(values) {
        if (!Array.isArray(values) || values.length < 2) {
            return { slope: 0, intercept: 0, r2: 0 };
        }

        const n = values.length;
        const xMean = (n - 1) / 2;
        const yMean = values.reduce((a, b) => a + b, 0) / n;

        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            const xDiff = i - xMean;
            const yDiff = values[i] - yMean;
            numerator += xDiff * yDiff;
            denominator += xDiff * xDiff;
        }

        const slope = denominator !== 0 ? numerator / denominator : 0;
        const intercept = yMean - slope * xMean;

        // Calculate R-squared
        const yPred = values.map((_, i) => slope * i + intercept);
        const ssTotal = values.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
        const ssResidual = values.reduce((sum, y, i) => sum + Math.pow(y - yPred[i], 2), 0);
        const r2 = ssTotal !== 0 ? 1 - (ssResidual / ssTotal) : 0;

        return { slope, intercept, r2 };
    }

    calculateCorrelation(x, y) {
        if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length || x.length < 2) {
            return 0;
        }

        const n = x.length;
        const xMean = x.reduce((a, b) => a + b, 0) / n;
        const yMean = y.reduce((a, b) => a + b, 0) / n;

        let numerator = 0;
        let denominatorX = 0;
        let denominatorY = 0;

        for (let i = 0; i < n; i++) {
            const xDiff = x[i] - xMean;
            const yDiff = y[i] - yMean;
            numerator += xDiff * yDiff;
            denominatorX += xDiff * xDiff;
            denominatorY += yDiff * yDiff;
        }

        if (denominatorX === 0 || denominatorY === 0) {
            return 0;
        }

        return numerator / Math.sqrt(denominatorX * denominatorY);
    }
}

export default new BIService(); 