import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert, Form, Table } from "react-bootstrap";
import { ArrowUp, BarChart as BarChartIcon, PieChart as PieChartIcon, GraphUp as LineChartIcon, GeoAlt, Calendar as CalendarIcon, CurrencyDollar } from "react-bootstrap-icons";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const MarketTrends = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate realistic market data
  const generateMarketData = () => {
    const periods = {
      '3months': 3,
      '6months': 6,
      '1year': 12,
      '2years': 24
    };

    const months = periods[selectedPeriod];
    const data = [];
    const basePrice = 350000;
    const volatility = 0.05;

    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const trend = Math.sin(i * 0.5) * 0.1 + (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + trend);
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        averagePrice: Math.round(price),
        sales: Math.round(50 + Math.random() * 30),
        inventory: Math.round(200 + Math.random() * 100),
        daysOnMarket: Math.round(30 + Math.random() * 20)
      });
    }

    return data;
  };

  const propertyTypeData = [
    { name: 'Houses', value: 45, color: '#8884d8' },
    { name: 'Apartments', value: 30, color: '#82ca9d' },
    { name: 'Condos', value: 15, color: '#ffc658' },
    { name: 'Townhouses', value: 10, color: '#ff7300' }
  ];

  const priceRangeData = [
    { range: 'Under $200k', count: 15, percentage: 15 },
    { range: '$200k - $400k', count: 35, percentage: 35 },
    { range: '$400k - $600k', count: 25, percentage: 25 },
    { range: '$600k - $800k', count: 15, percentage: 15 },
    { range: 'Over $800k', count: 10, percentage: 10 }
  ];

  const topNeighborhoods = [
    { name: 'Downtown', avgPrice: 450000, change: 8.5, sales: 45 },
    { name: 'Riverside', avgPrice: 380000, change: 12.3, sales: 32 },
    { name: 'Hillside', avgPrice: 520000, change: 5.2, sales: 28 },
    { name: 'Garden District', avgPrice: 340000, change: 15.7, sales: 38 },
    { name: 'University Area', avgPrice: 290000, change: 3.1, sales: 42 }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMarketData(generateMarketData());
      setLoading(false);
    }, 1000);
  }, [selectedPeriod, selectedLocation]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTrendIcon = (change) => {
    return change > 0 ? <ArrowUp className="text-success" /> : <ArrowUp className="text-danger" style={{ transform: 'rotate(180deg)' }} />;
  };

  const getTrendColor = (change) => {
    return change > 0 ? 'success' : 'danger';
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading market trends...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">
            <BarChartIcon className="me-2" />
            Market Trends Dashboard
          </h2>
          <p className="text-muted">
            Real-time market analysis and property trends
          </p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Time Period</Form.Label>
            <Form.Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="2years">Last 2 Years</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Location</Form.Label>
            <Form.Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">All Areas</option>
              <option value="downtown">Downtown</option>
              <option value="riverside">Riverside</option>
              <option value="hillside">Hillside</option>
              <option value="garden">Garden District</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <CurrencyDollar size={24} className="text-primary mb-2" />
              <h4 className="text-primary">
                {formatPrice(marketData?.[marketData.length - 1]?.averagePrice || 0)}
              </h4>
              <p className="text-muted mb-0">Average Price</p>
              <Badge bg="success" className="mt-1">+5.2%</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <BarChartIcon size={24} className="text-success mb-2" />
              <h4 className="text-success">
                {marketData?.[marketData.length - 1]?.sales || 0}
              </h4>
              <p className="text-muted mb-0">Monthly Sales</p>
              <Badge bg="info" className="mt-1">+12%</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <CalendarIcon size={24} className="text-warning mb-2" />
              <h4 className="text-warning">
                {marketData?.[marketData.length - 1]?.daysOnMarket || 0}
              </h4>
              <p className="text-muted mb-0">Days on Market</p>
              <Badge bg="secondary" className="mt-1">-8%</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <GeoAlt size={24} className="text-info mb-2" />
              <h4 className="text-info">
                {marketData?.[marketData.length - 1]?.inventory || 0}
              </h4>
              <p className="text-muted mb-0">Active Listings</p>
              <Badge bg="primary" className="mt-1">+3%</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Price Trends</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [formatPrice(value), 'Average Price']} />
                  <Line 
                    type="monotone" 
                    dataKey="averagePrice" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Property Types</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <RechartsPieChart
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Sales Volume</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#82ca9d" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Price Ranges</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={priceRangeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="range" type="category" />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#8884d8" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Neighborhoods */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Top Performing Neighborhoods</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Neighborhood</th>
                    <th>Average Price</th>
                    <th>Price Change</th>
                    <th>Monthly Sales</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {topNeighborhoods.map((neighborhood, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{neighborhood.name}</strong>
                      </td>
                      <td>{formatPrice(neighborhood.avgPrice)}</td>
                      <td>
                        <Badge bg={getTrendColor(neighborhood.change)}>
                          {neighborhood.change > 0 ? '+' : ''}{neighborhood.change}%
                        </Badge>
                      </td>
                      <td>{neighborhood.sales}</td>
                      <td>
                        {getTrendIcon(neighborhood.change)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Market Insights */}
      <Row className="mt-4">
        <Col>
          <Alert variant="info">
            <h6>Market Insights</h6>
            <ul className="mb-0">
              <li>Property prices have increased by 5.2% over the selected period</li>
              <li>Sales volume is up 12% compared to last month</li>
              <li>Average days on market decreased by 8%</li>
              <li>Garden District shows the highest growth at 15.7%</li>
              <li>Inventory levels are stable with 3% increase</li>
            </ul>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default MarketTrends;
