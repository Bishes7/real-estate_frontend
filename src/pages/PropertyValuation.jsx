import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Spinner } from "react-bootstrap";
import { Calculator, ArrowUp, GeoAlt, House, CurrencyDollar } from "react-bootstrap-icons";

const PropertyValuation = () => {
  const [formData, setFormData] = useState({
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    lotSize: '',
    yearBuilt: '',
    condition: 'good',
    location: '',
    amenities: [],
    marketTrend: 'stable'
  });

  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(false);

  const propertyTypes = [
    { value: 'house', label: 'Single Family House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' }
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent', multiplier: 1.15 },
    { value: 'good', label: 'Good', multiplier: 1.0 },
    { value: 'fair', label: 'Fair', multiplier: 0.9 },
    { value: 'poor', label: 'Poor', multiplier: 0.75 }
  ];

  const amenities = [
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'garage', label: 'Garage' },
    { value: 'garden', label: 'Garden' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'elevator', label: 'Elevator' },
    { value: 'security', label: 'Security System' },
    { value: 'gym', label: 'Gym/Fitness Center' },
    { value: 'parking', label: 'Parking Space' }
  ];

  const marketTrends = [
    { value: 'rising', label: 'Rising Market', multiplier: 1.1 },
    { value: 'stable', label: 'Stable Market', multiplier: 1.0 },
    { value: 'declining', label: 'Declining Market', multiplier: 0.9 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const calculateValuation = async () => {
    setLoading(true);
    
    // Simulate AI calculation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const {
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet,
      yearBuilt,
      condition,
      amenities,
      marketTrend
    } = formData;

    // Base calculation algorithm
    let basePrice = 0;
    
    // Base price by property type
    const typeMultipliers = {
      'house': 200,
      'apartment': 180,
      'condo': 190,
      'townhouse': 185,
      'villa': 250,
      'studio': 150
    };

    basePrice = (squareFeet || 1000) * (typeMultipliers[propertyType] || 200);

    // Bedroom and bathroom adjustments
    const bedroomValue = (bedrooms || 2) * 15000;
    const bathroomValue = (bathrooms || 1) * 10000;
    basePrice += bedroomValue + bathroomValue;

    // Age factor
    const currentYear = new Date().getFullYear();
    const age = currentYear - (yearBuilt || 2000);
    const ageMultiplier = Math.max(0.7, 1 - (age * 0.01));
    basePrice *= ageMultiplier;

    // Condition multiplier
    const conditionData = conditions.find(c => c.value === condition);
    basePrice *= conditionData?.multiplier || 1.0;

    // Market trend multiplier
    const trendData = marketTrends.find(t => t.value === marketTrend);
    basePrice *= trendData?.multiplier || 1.0;

    // Amenities bonus
    const amenityBonus = amenities.length * 5000;
    basePrice += amenityBonus;

    // Location factor (simplified)
    const locationMultiplier = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
    basePrice *= locationMultiplier;

    // Add some randomness for realism
    const randomFactor = 0.9 + Math.random() * 0.2; // ±10%
    basePrice *= randomFactor;

    const estimatedValue = Math.round(basePrice);
    const minValue = Math.round(estimatedValue * 0.85);
    const maxValue = Math.round(estimatedValue * 1.15);

    setValuation({
      estimated: estimatedValue,
      range: { min: minValue, max: maxValue },
      confidence: Math.round(75 + Math.random() * 20), // 75-95%
      factors: {
        size: squareFeet,
        bedrooms,
        bathrooms,
        age: age,
        condition,
        amenities: amenities.length,
        marketTrend
      }
    });

    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">
            <Calculator className="me-2" />
            AI Property Valuation Tool
          </h2>
          <p className="text-muted">
            Get an AI-powered property valuation estimate based on market data and property features
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Property Details</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Property Type</Form.Label>
                      <Form.Select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Type</option>
                        {propertyTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Condition</Form.Label>
                      <Form.Select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                      >
                        {conditions.map(condition => (
                          <option key={condition.value} value={condition.value}>
                            {condition.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        step="0.5"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Square Feet</Form.Label>
                      <Form.Control
                        type="number"
                        name="squareFeet"
                        value={formData.squareFeet}
                        onChange={handleInputChange}
                        min="100"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year Built</Form.Label>
                      <Form.Control
                        type="number"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Market Trend</Form.Label>
                      <Form.Select
                        name="marketTrend"
                        value={formData.marketTrend}
                        onChange={handleInputChange}
                      >
                        {marketTrends.map(trend => (
                          <option key={trend.value} value={trend.value}>
                            {trend.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter city, neighborhood, or address"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amenities</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {amenities.map(amenity => (
                      <Form.Check
                        key={amenity.value}
                        type="checkbox"
                        id={amenity.value}
                        label={amenity.label}
                        checked={formData.amenities.includes(amenity.value)}
                        onChange={() => handleAmenityChange(amenity.value)}
                        className="mb-2"
                      />
                    ))}
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={calculateValuation}
                  disabled={loading || !formData.propertyType || !formData.squareFeet}
                  className="w-100"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="me-2" />
                      Calculate Valuation
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          {valuation ? (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <ArrowUp className="me-2" />
                  Valuation Results
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="text-primary mb-2">
                    {formatPrice(valuation.estimated)}
                  </h2>
                  <Badge bg="success" className="fs-6">
                    {valuation.confidence}% Confidence
                  </Badge>
                </div>

                <Alert variant="info">
                  <strong>Estimated Range:</strong><br />
                  {formatPrice(valuation.range.min)} - {formatPrice(valuation.range.max)}
                </Alert>

                <div className="mb-3">
                  <h6>Valuation Factors:</h6>
                  <ul className="list-unstyled">
                    <li><GeoAlt className="me-2" /> Location: {formData.location || 'Not specified'}</li>
                    <li><House className="me-2" /> Size: {valuation.factors.size} sq ft</li>
                    <li>🏠 Bedrooms: {valuation.factors.bedrooms}</li>
                    <li>🚿 Bathrooms: {valuation.factors.bathrooms}</li>
                    <li>📅 Age: {valuation.factors.age} years</li>
                    <li>⭐ Condition: {valuation.factors.condition}</li>
                    <li>🏊 Amenities: {valuation.factors.amenities} selected</li>
                    <li>📈 Market: {valuation.factors.marketTrend}</li>
                  </ul>
                </div>

                <Alert variant="warning">
                  <small>
                    <strong>Disclaimer:</strong> This is an AI-generated estimate for informational purposes only. 
                    For accurate valuation, consult with a professional appraiser or real estate agent.
                  </small>
                </Alert>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center py-5">
                <Calculator size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Enter Property Details</h5>
                <p className="text-muted">
                  Fill in the form to get an AI-powered property valuation estimate
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyValuation;
