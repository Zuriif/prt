import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, AreaChart, Area,
    ScatterChart, Scatter, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Card, Row, Col, Button, Select, DatePicker, Spin, Alert } from 'antd';
import { 
    DownloadOutlined, 
    ReloadOutlined, 
    FilterOutlined 
} from '@ant-design/icons';
import biService from '../services/biService';
import '../style/BIDashboard.css';
import { COLORS } from '../utils/colors';

const { RangePicker } = DatePicker;
const { Option } = Select;

const BIDashboard = () => {
    const [timeframe, setTimeframe] = useState('monthly');
    const [dateRange, setDateRange] = useState([null, null]);
    const [metrics, setMetrics] = useState({});
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productTimeSeries, setProductTimeSeries] = useState({});
    const [correlations, setCorrelations] = useState({});
    const [scorecard, setScorecard] = useState({});

    useEffect(() => {
        fetchBIData();
        fetchProductTimeSeries();
        fetchCorrelations();
        fetchScorecard();
    }, [timeframe, dateRange]);

    const fetchBIData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching BI data...');
            
            // Fetch data from services
            const [entityData, sectorData] = await Promise.all([
                biService.getEntityAnalytics(),
                biService.getSectorAnalysis()
            ]);

            console.log('Raw Entity Data:', entityData);
            console.log('Raw Sector Data:', sectorData);

            // Process and set the metrics
            const processedMetrics = {
                entity: entityData,
                sector: sectorData
            };

            console.log('Processed Metrics:', processedMetrics);
            setMetrics(processedMetrics);

            // Generate insights based on the processed data
            const generatedInsights = generateInsights(processedMetrics);
            console.log('Generated Insights:', generatedInsights);
            setInsights(generatedInsights);
            
            setLoading(false);
        } catch (error) {
            console.error('Error in fetchBIData:', error);
            setError(error.message || 'Failed to fetch BI data');
            setLoading(false);
        }
    };

    const fetchProductTimeSeries = async () => {
        try {
            const data = await biService.getProductTimeSeries(timeframe);
            setProductTimeSeries(data.timeSeriesData || {});
        } catch (error) {
            console.error('Error fetching product time series:', error);
        }
    };

    const fetchCorrelations = async () => {
        try {
            const data = await biService.getBusinessCorrelations();
            setCorrelations(data);
        } catch (error) {
            console.error('Error fetching correlations:', error);
        }
    };

    const fetchScorecard = async () => {
        try {
            const data = await biService.getBusinessScorecard();
            setScorecard(data);
        } catch (error) {
            console.error('Error fetching scorecard:', error);
        }
    };

    const generateInsights = (metrics) => {
        const insights = [];
        
        // Entity insights
        if (metrics.entity?.entityDistribution) {
            const totalEntities = metrics.entity.totalEntities || 0;
            const totalTypes = metrics.entity.totalTypes || 0;
            
            insights.push({
                title: 'Entity Overview',
                description: `Total of ${totalEntities} entities across ${totalTypes} types`,
                value: totalEntities,
                trend: 'stable'
            });

            // Add insights for top entity types
            const topTypes = Object.entries(metrics.entity.entityDistribution)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3);

            topTypes.forEach(([type, count]) => {
                insights.push({
                    title: `Top Entity Type: ${type}`,
                    description: `${count} entities (${((count / totalEntities) * 100).toFixed(1)}%)`,
                    value: count,
                    trend: 'up'
                });
            });
        }

        // Sector insights
        if (metrics.sector?.secteurs) {
            const totalSectors = Object.keys(metrics.sector.secteurs).length;
            const totalEntities = Object.values(metrics.sector.secteurs).reduce((sum, count) => sum + count, 0);

            insights.push({
                title: 'Sector Overview',
                description: `Entities distributed across ${totalSectors} sectors`,
                value: totalSectors,
                trend: 'stable'
            });

            // Add insights for top sectors
            const topSectors = Object.entries(metrics.sector.secteurs)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3);

            topSectors.forEach(([sector, count]) => {
                insights.push({
                    title: `Top Sector: ${sector}`,
                    description: `${count} entities (${((count / totalEntities) * 100).toFixed(1)}%)`,
                    value: count,
                    trend: 'up'
                });
            });
        }

        return insights;
    };

    const renderTimeSeriesChart = () => (
        <Card title="Time Series Analysis" className="chart-card">
            {metrics.timeSeries && metrics.timeSeries.data && metrics.timeSeries.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={metrics.timeSeries.data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="forecast" 
                            stroke="#82ca9d" 
                            fillOpacity={0.3} 
                            fill="#82ca9d" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div style={{ padding: 24, textAlign: 'center' }}>No time series data available.</div>
            )}
        </Card>
    );

    const renderProductTimeSeriesChart = () => (
        <Card title="Product Creation Time Series" className="chart-card">
            {productTimeSeries && Object.keys(productTimeSeries).length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={Object.entries(productTimeSeries).map(([date, value]) => ({ date, value }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div style={{ padding: 24, textAlign: 'center' }}>No product time series data available.</div>
            )}
        </Card>
    );

    const renderEntityDistribution = () => {
        if (!metrics?.entity?.entityDistribution) {
            return (
                <Card title="Entity Distribution by Type" className="chart-card" style={{ minHeight: '550px' }}>
                    <div style={{ padding: 24, textAlign: 'center' }}>No entity distribution data available.</div>
                </Card>
            );
        }

        const distributionData = Object.entries(metrics.entity.entityDistribution)
            .map(([name, value]) => {
                const performance = metrics.entity?.performance?.[name] || {};
                return {
                    name,
                    value,
                    percentage: performance?.percentage || 0,
                    details: performance?.details || {}
                };
            })
            .filter(item => item.name && item.value !== undefined);

        if (distributionData.length === 0) {
            return (
                <Card title="Entity Distribution by Type" className="chart-card" style={{ minHeight: '550px' }}>
                    <div style={{ padding: 24, textAlign: 'center' }}>No valid entity distribution data available.</div>
                </Card>
            );
        }

        return (
            <Card title="Entity Distribution by Type" className="chart-card" style={{ minHeight: '550px' }}>
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={distributionData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip 
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div style={{ 
                                                backgroundColor: 'white', 
                                                padding: '10px', 
                                                border: '1px solid #ccc',
                                                borderRadius: '4px'
                                            }}>
                                                <p style={{ margin: 0 }}><strong>{data.name}</strong></p>
                                                <p style={{ margin: '5px 0' }}>Count: {data.value}</p>
                                                <p style={{ margin: '5px 0' }}>Percentage: {data.percentage.toFixed(1)}%</p>
                                                {data.details && Object.keys(data.details).length > 0 && (
                                                    <>
                                                        <p style={{ margin: '5px 0' }}>Type: {data.details.type || 'N/A'}</p>
                                                        <p style={{ margin: '5px 0' }}>Status: {data.details.status || 'N/A'}</p>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Number of Entities">
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <p>Total Entities: {metrics.entity?.totalEntities || 0}</p>
                        <p>Total Types: {metrics.entity?.totalTypes || 0}</p>
                    </div>

                    {/* Summary Section for Entity Distribution */}
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '15px', 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '4px' 
                    }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <h4>Total Entities</h4>
                                    <p style={{ fontSize: '24px', margin: 0 }}>
                                        {metrics.entity?.totalEntities || 0}
                                    </p>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <h4>Total Types</h4>
                                    <p style={{ fontSize: '24px', margin: 0 }}>
                                        {metrics.entity?.totalTypes || 0}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Entity Distribution Table */}
                    <div style={{ marginTop: '20px' }}>
                        <h4>Entity Type Breakdown</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f0f0f0' }}>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>Type</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Entities</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {distributionData.map((type, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '8px' }}>{type.name}</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>{type.value}</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>
                                            {type.percentage?.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        );
    };

    const renderSectorAnalysis = () => {
        if (!metrics?.sector?.secteurs) {
            return (
                <Card title="Sector Analysis" className="chart-card" style={{ minHeight: '550px' }}>
                    <div style={{ padding: 24, textAlign: 'center' }}>No sector analysis data available.</div>
                </Card>
            );
        }

        // Prepare the data for the nested visualization
        const sectorData = Object.entries(metrics.sector.secteurs)
            .map(([sectorName, sectorCount]) => {
                // Find all sub-sectors that belong to this sector
                const subSectors = Object.entries(metrics.sector.sousSecteurs || {})
                    .filter(([subSectorName]) => {
                        // This is a simple heuristic - you might need to adjust this based on your data structure
                        return subSectorName.toLowerCase().includes(sectorName.toLowerCase());
                    })
                    .map(([subSectorName, count]) => ({
                        name: subSectorName,
                        value: count,
                        type: 'sub-sector'
                    }));

                return {
                    name: sectorName,
                    value: sectorCount,
                    type: 'sector',
                    children: subSectors,
                    percentage: metrics.sector?.performance?.[sectorName]?.percentage || 0
                };
            })
            .filter(item => item.name && item.value !== undefined);

        // Sort sectors by count
        sectorData.sort((a, b) => b.value - a.value);

        // Calculate total entities for percentage
        const totalEntities = sectorData.reduce((sum, item) => sum + item.value, 0);

        return (
            <Card title="Sector Analysis" className="chart-card" style={{ minHeight: '550px' }}>
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={sectorData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            barGap={0}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip 
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div style={{ 
                                                backgroundColor: 'white', 
                                                padding: '10px', 
                                                border: '1px solid #ccc',
                                                borderRadius: '4px'
                                            }}>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
                                                <p style={{ margin: '5px 0' }}>Count: {data.value}</p>
                                                <p style={{ margin: '5px 0' }}>
                                                    Percentage: {((data.value / totalEntities) * 100).toFixed(1)}%
                                                </p>
                                                {data.children && data.children.length > 0 && (
                                                    <>
                                                        <p style={{ margin: '10px 0 5px 0', fontWeight: 'bold' }}>
                                                            Sub-sectors:
                                                        </p>
                                                        {data.children.map((child, index) => (
                                                            <p key={index} style={{ margin: '2px 0', paddingLeft: '10px' }}>
                                                                {child.name}: {child.value} entities
                                                            </p>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Bar 
                                dataKey="value" 
                                name="Number of Entities"
                                fill="#8884d8"
                            >
                                {sectorData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]}
                                        opacity={0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Summary Section */}
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '15px', 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '4px' 
                    }}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <h4>Total Sectors</h4>
                                    <p style={{ fontSize: '24px', margin: 0 }}>
                                        {Object.keys(metrics.sector.secteurs).length}
                                    </p>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <h4>Total Sub-sectors</h4>
                                    <p style={{ fontSize: '24px', margin: 0 }}>
                                        {Object.keys(metrics.sector.sousSecteurs || {}).length}
                                    </p>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <h4>Total Entities</h4>
                                    <p style={{ fontSize: '24px', margin: 0 }}>
                                        {totalEntities}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Top Sectors Table */}
                    <div style={{ marginTop: '20px' }}>
                        <h4>Top Sectors</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f0f0f0' }}>
                                    <th style={{ padding: '8px', textAlign: 'left' }}>Sector</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Entities</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Percentage</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Growth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectorData.slice(0, 5).map((sector, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '8px' }}>{sector.name}</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>{sector.value}</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>
                                            {((sector.value / totalEntities) * 100).toFixed(1)}%
                                        </td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>
                                            {metrics.sector?.trends?.[sector.name]?.growth?.toFixed(1) || 0}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        );
    };

    const renderBusinessScorecard = () => {
        if (!scorecard || Object.keys(scorecard).length === 0) {
            return (
                <Card title="Business Intelligence Scorecard" className="chart-card">
                    <div style={{ padding: 24, textAlign: 'center' }}>No scorecard data available.</div>
                </Card>
            );
        }

        return (
            <Card title="Business Intelligence Scorecard" className="chart-card">
                <Row gutter={[16, 16]}>
                    {/* Overall Score */}
                    {scorecard.summary && (
                        <Col span={24}>
                            <Card size="small" title="Overall Performance Score">
                                <Row gutter={16}>
                                    <Col span={6}>
                                        <div style={{ textAlign: 'center' }}>
                                            <h2 style={{ color: '#1890ff', margin: 0 }}>
                                                {scorecard.summary.overallScore?.toFixed(1) || 'N/A'}
                                            </h2>
                                            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                                                {scorecard.summary.scoreGrade || 'N/A'}
                                            </p>
                                            <p style={{ margin: 0, color: '#666' }}>Overall Score</p>
                                        </div>
                                    </Col>
                                    <Col span={18}>
                                        <div>
                                            <h4>Key Highlights:</h4>
                                            <ul>
                                                {scorecard.summary.highlights?.map((highlight, index) => (
                                                    <li key={index}>{highlight}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    )}

                    {/* KPIs */}
                    {scorecard.kpis && (
                        <Col span={12}>
                            <Card size="small" title="Key Performance Indicators">
                                <Row gutter={[8, 8]}>
                                    <Col span={12}>
                                        <div style={{ textAlign: 'center', padding: '8px' }}>
                                            <h3 style={{ margin: 0, color: '#52c41a' }}>
                                                {scorecard.kpis.totalEntities || 0}
                                            </h3>
                                            <p style={{ margin: 0, fontSize: '12px' }}>Total Entities</p>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ textAlign: 'center', padding: '8px' }}>
                                            <h3 style={{ margin: 0, color: '#1890ff' }}>
                                                {scorecard.kpis.activityRate?.toFixed(1) || '0'}%
                                            </h3>
                                            <p style={{ margin: 0, fontSize: '12px' }}>Activity Rate</p>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ textAlign: 'center', padding: '8px' }}>
                                            <h3 style={{ margin: 0, color: '#722ed1' }}>
                                                {scorecard.kpis.sectorDiversity || 0}
                                            </h3>
                                            <p style={{ margin: 0, fontSize: '12px' }}>Sector Diversity</p>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ textAlign: 'center', padding: '8px' }}>
                                            <h3 style={{ margin: 0, color: '#fa8c16' }}>
                                                {scorecard.kpis.regionalCoverage || 0}
                                            </h3>
                                            <p style={{ margin: 0, fontSize: '12px' }}>Regional Coverage</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    )}

                    {/* Top Rankings */}
                    {scorecard.rankings && (
                        <Col span={12}>
                            <Card size="small" title="Top Performers">
                                <div style={{ marginBottom: 16 }}>
                                    <h4>Top Sectors:</h4>
                                    {scorecard.rankings.topSectors?.slice(0, 3).map((sector, index) => (
                                        <div key={index} style={{ marginBottom: 8 }}>
                                            <strong>{sector.name}</strong>: {sector.count} entities 
                                            ({sector.percentage?.toFixed(1)}%)
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4>Top Regions:</h4>
                                    {scorecard.rankings.topRegions?.slice(0, 3).map((region, index) => (
                                        <div key={index} style={{ marginBottom: 8 }}>
                                            <strong>{region.name}</strong>: {region.count} entities
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    )}

                    {/* Action Items */}
                    {scorecard.actionItems && (
                        <Col span={24}>
                            <Card size="small" title="Action Items">
                                <Row gutter={[16, 16]}>
                                    {/* High Priority */}
                                    {scorecard.actionItems.highPriority && scorecard.actionItems.highPriority.length > 0 && (
                                        <Col span={8}>
                                            <Card size="small" title="High Priority" style={{ borderColor: '#ff4d4f' }}>
                                                {scorecard.actionItems.highPriority.map((action, index) => (
                                                    <div key={index} style={{ marginBottom: 12 }}>
                                                        <h5 style={{ margin: 0, color: '#ff4d4f' }}>{action.title}</h5>
                                                        <p style={{ margin: '4px 0', fontSize: '12px' }}>{action.description}</p>
                                                        <small style={{ color: '#666' }}>
                                                            Timeline: {action.timeline} | Impact: {action.impact}
                                                        </small>
                                                    </div>
                                                ))}
                                            </Card>
                                        </Col>
                                    )}

                                    {/* Medium Priority */}
                                    {scorecard.actionItems.mediumPriority && scorecard.actionItems.mediumPriority.length > 0 && (
                                        <Col span={8}>
                                            <Card size="small" title="Medium Priority" style={{ borderColor: '#fa8c16' }}>
                                                {scorecard.actionItems.mediumPriority.map((action, index) => (
                                                    <div key={index} style={{ marginBottom: 12 }}>
                                                        <h5 style={{ margin: 0, color: '#fa8c16' }}>{action.title}</h5>
                                                        <p style={{ margin: '4px 0', fontSize: '12px' }}>{action.description}</p>
                                                        <small style={{ color: '#666' }}>
                                                            Timeline: {action.timeline} | Impact: {action.impact}
                                                        </small>
                                                    </div>
                                                ))}
                                            </Card>
                                        </Col>
                                    )}

                                    {/* Low Priority */}
                                    {scorecard.actionItems.lowPriority && scorecard.actionItems.lowPriority.length > 0 && (
                                        <Col span={8}>
                                            <Card size="small" title="Low Priority" style={{ borderColor: '#52c41a' }}>
                                                {scorecard.actionItems.lowPriority.map((action, index) => (
                                                    <div key={index} style={{ marginBottom: 12 }}>
                                                        <h5 style={{ margin: 0, color: '#52c41a' }}>{action.title}</h5>
                                                        <p style={{ margin: '4px 0', fontSize: '12px' }}>{action.description}</p>
                                                        <small style={{ color: '#666' }}>
                                                            Timeline: {action.timeline} | Impact: {action.impact}
                                                        </small>
                                                    </div>
                                                ))}
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            </Card>
                        </Col>
                    )}

                    {/* Performance Analysis */}
                    {scorecard.summary?.performance && (
                        <Col span={24}>
                            <Card size="small" title="Performance Analysis">
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <h4 style={{ color: '#52c41a' }}>Strengths:</h4>
                                        <ul>
                                            {scorecard.summary.performance.strengths?.map((strength, index) => (
                                                <li key={index}>{strength}</li>
                                            ))}
                                        </ul>
                                    </Col>
                                    <Col span={8}>
                                        <h4 style={{ color: '#ff4d4f' }}>Weaknesses:</h4>
                                        <ul>
                                            {scorecard.summary.performance.weaknesses?.map((weakness, index) => (
                                                <li key={index}>{weakness}</li>
                                            ))}
                                        </ul>
                                    </Col>
                                    <Col span={8}>
                                        <h4 style={{ color: '#1890ff' }}>Opportunities:</h4>
                                        <ul>
                                            {scorecard.summary.performance.opportunities?.map((opportunity, index) => (
                                                <li key={index}>{opportunity}</li>
                                            ))}
                                        </ul>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Card>
        );
    };

    const renderInsights = () => (
        <Card title="Business Insights" className="insights-card">
            <Row gutter={[16, 16]}>
                {insights.map((insight, index) => (
                    <Col span={8} key={index}>
                        <Card size="small" className="insight-card">
                            <h4>{insight.title}</h4>
                            <p>{insight.description}</p>
                            <div className="insight-metrics">
                                <span className="metric">
                                    {insight.value}
                                </span>
                                <span className={`trend ${insight.trend > 0 ? 'positive' : 'negative'}`}>
                                    {insight.trend > 0 ? '+' : ''}{insight.trend}%
                                </span>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <p>Loading advanced analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
            />
        );
    }

    return (
        <div className="bi-dashboard">
            <div className="dashboard-header">
                <h2>Business Intelligence Dashboard</h2>
                <div className="controls">
                    <Select 
                        value={timeframe} 
                        onChange={setTimeframe}
                        style={{ width: 120 }}
                    >
                        <Option value="daily">Daily</Option>
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                        <Option value="quarterly">Quarterly</Option>
                    </Select>
                    <RangePicker 
                        value={dateRange}
                        onChange={setDateRange}
                    />
                    <Button 
                        icon={<ReloadOutlined />}
                        onClick={fetchBIData}
                    >
                        Refresh
                    </Button>
                    <Button 
                        icon={<DownloadOutlined />}
                        onClick={() => exportDashboard()}
                    >
                        Export
                    </Button>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    {renderProductTimeSeriesChart()}
                </Col>
                <Col span={12}>
                    {renderEntityDistribution()}
                </Col>
                <Col span={12}>
                    {renderSectorAnalysis()}
                </Col>
                <Col span={24}>
                    {renderBusinessScorecard()}
                </Col>
                <Col span={24}>
                    {renderInsights()}
                </Col>
            </Row>
        </div>
    );
};

export default BIDashboard; 