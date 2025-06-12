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

    useEffect(() => {
        fetchBIData();
        fetchProductTimeSeries();
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
                <Card title="Entity Distribution by Type" className="chart-card">
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
                <Card title="Entity Distribution by Type" className="chart-card">
                    <div style={{ padding: 24, textAlign: 'center' }}>No valid entity distribution data available.</div>
                </Card>
            );
        }

        return (
            <Card title="Entity Distribution by Type" className="chart-card">
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
                </div>
            </Card>
        );
    };

    const renderSectorAnalysis = () => {
        if (!metrics?.sector?.secteurs) {
            return (
                <Card title="Sector Analysis" className="chart-card">
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
            <Card title="Sector Analysis" className="chart-card">
                <div>
                    <ResponsiveContainer width="100%" height={500}>
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

    const renderCorrelationAnalysis = () => (
        <Card title="Correlation Analysis" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                    <CartesianGrid />
                    <XAxis dataKey="x" />
                    <YAxis dataKey="y" />
                    <Tooltip />
                    <Scatter 
                        data={metrics.aggregated?.correlations || []} 
                        fill="#8884d8" 
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </Card>
    );

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
                    {renderTimeSeriesChart()}
                </Col>
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
                    {renderCorrelationAnalysis()}
                </Col>
                <Col span={24}>
                    {renderInsights()}
                </Col>
            </Row>
        </div>
    );
};

export default BIDashboard; 