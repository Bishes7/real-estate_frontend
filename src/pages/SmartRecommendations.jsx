import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert, Form, ProgressBar } from "react-bootstrap";
import { useGetListingsQuery } from "../slices/listingsApiSlice";
import { useGetFavoritesQuery } from "../slices/usersApiSlice";
import { Lightbulb, Star, StarFill, GeoAlt, CurrencyDollar, House, ArrowUp } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const SmartRecommendations = () => {
  const [preferences, setPreferences] = useState({
    priceRange: { min: '', max: '' },
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    amenities: [],
    priorities: []
  });

  const [recommendations, setRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: listings, isLoading, error: listingsError } = useGetListingsQuery({ limit: 50, startIndex: 0 });
  const { data: favorites, error: favoritesError } = useGetFavoritesQuery(undefined, {
    skip: false, // Allow the query to run
    refetchOnMountOrArgChange: true
  });
  
  // Debug logging
  console.log('SmartRecommendations - listings:', listings);
  console.log('SmartRecommendations - favorites:', favorites);
  console.log('SmartRecommendations - isLoading:', isLoading);
  console.log('SmartRecommendations - listingsError:', listingsError);
  console.log('SmartRecommendations - recommendations state:', recommendations);
  console.log('SmartRecommendations - loading state:', loading);

  const propertyTypes = [
    'house', 'apartment', 'townhouse', 'villa', 'studio'
  ];

  const amenities = [
    'pool', 'garage', 'garden', 'balcony', 'elevator', 'security', 'gym', 'parking'
  ];

  const priorities = [
    { value: 'price', label: 'Best Price', weight: 0.3 },
    { value: 'location', label: 'Prime Location', weight: 0.25 },
    { value: 'size', label: 'Larger Space', weight: 0.2 },
    { value: 'amenities', label: 'Premium Amenities', weight: 0.15 },
    { value: 'investment', label: 'Investment Potential', weight: 0.1 }
  ];

  // Analyze user behavior to build profile
  useEffect(() => {
    if (favorites && Array.isArray(favorites) && favorites.length > 0) {
      analyzeUserBehavior();
    }
  }, [favorites]);

  // Debug state changes
  useEffect(() => {
    console.log('Recommendations state changed:', recommendations);
  }, [recommendations]);

  useEffect(() => {
    console.log('Loading state changed:', loading);
  }, [loading]);

  const analyzeUserBehavior = () => {
    if (!favorites || !Array.isArray(favorites) || favorites.length === 0) return;

    const analysis = {
      preferredTypes: {},
      priceRange: { min: Infinity, max: 0 },
      bedroomPref: {},
      bathroomPref: {},
      amenityPref: {},
      locationPref: {}
    };

    favorites.forEach(property => {
      // Property type preference
      analysis.preferredTypes[property.type] = (analysis.preferredTypes[property.type] || 0) + 1;
      
      // Price range
      analysis.priceRange.min = Math.min(analysis.priceRange.min, property.regularPrice);
      analysis.priceRange.max = Math.max(analysis.priceRange.max, property.regularPrice);
      
      // Bedroom preference
      analysis.bedroomPref[property.bedrooms] = (analysis.bedroomPref[property.bedrooms] || 0) + 1;
      
      // Bathroom preference
      analysis.bathroomPref[property.bathrooms] = (analysis.bathroomPref[property.bathrooms] || 0) + 1;
      
      // Location preference (extract from address)
      const location = property.address?.split(',')[1]?.trim();
      if (location) {
        analysis.locationPref[location] = (analysis.locationPref[location] || 0) + 1;
      }
    });

    // Find most preferred values with safety checks
    const preferredTypeKeys = Object.keys(analysis.preferredTypes);
    const bedroomKeys = Object.keys(analysis.bedroomPref);
    const bathroomKeys = Object.keys(analysis.bathroomPref);
    const locationKeys = Object.keys(analysis.locationPref);
    
    const mostPreferredType = preferredTypeKeys.length > 0 
      ? preferredTypeKeys.reduce((a, b) => 
          analysis.preferredTypes[a] > analysis.preferredTypes[b] ? a : b
        )
      : 'house'; // default fallback
    
    const mostPreferredBedrooms = bedroomKeys.length > 0
      ? bedroomKeys.reduce((a, b) => 
          analysis.bedroomPref[a] > analysis.bedroomPref[b] ? a : b
        )
      : '2'; // default fallback
    
    const mostPreferredBathrooms = bathroomKeys.length > 0
      ? bathroomKeys.reduce((a, b) => 
          analysis.bathroomPref[a] > analysis.bathroomPref[b] ? a : b
        )
      : '2'; // default fallback

    const mostPreferredLocation = locationKeys.length > 0
      ? locationKeys.reduce((a, b) => 
          analysis.locationPref[a] > analysis.locationPref[b] ? a : b
        )
      : 'Unknown'; // default fallback

    // Ensure price range has valid values
    const validPriceRange = {
      min: analysis.priceRange.min === Infinity ? 0 : analysis.priceRange.min,
      max: analysis.priceRange.max === 0 ? 1000000 : analysis.priceRange.max
    };

    setUserProfile({
      preferredType: mostPreferredType,
      priceRange: validPriceRange,
      preferredBedrooms: parseInt(mostPreferredBedrooms) || 2,
      preferredBathrooms: parseInt(mostPreferredBathrooms) || 2,
      preferredLocation: mostPreferredLocation,
      confidence: Math.min(95, 60 + (favorites.length * 5)) // Confidence based on data points
    });
  };

  const calculateMatchScore = (property) => {
    console.log('Calculating match score for property:', property.name);
    let score = 0;
    let factors = [];

    // Price range match (30% weight)
    if (preferences.priceRange.min && preferences.priceRange.max) {
      const price = property.regularPrice;
      const min = parseInt(preferences.priceRange.min);
      const max = parseInt(preferences.priceRange.max);
      
      if (price >= min && price <= max) {
        score += 30;
        factors.push({ name: 'Price Range', weight: 30, match: true });
      } else {
        const priceDiff = Math.min(Math.abs(price - min), Math.abs(price - max));
        const priceScore = Math.max(0, 30 - (priceDiff / 10000));
        score += priceScore;
        factors.push({ name: 'Price Range', weight: priceScore, match: false });
      }
    }

    // Property type match (25% weight)
    if (preferences.propertyType && property.type === preferences.propertyType) {
      score += 25;
      factors.push({ name: 'Property Type', weight: 25, match: true });
    } else if (userProfile?.preferredType === property.type) {
      score += 20;
      factors.push({ name: 'Property Type (AI)', weight: 20, match: true });
    }

    // Bedroom match (15% weight)
    if (preferences.bedrooms && property.bedrooms === parseInt(preferences.bedrooms)) {
      score += 15;
      factors.push({ name: 'Bedrooms', weight: 15, match: true });
    } else if (userProfile?.preferredBedrooms === property.bedrooms) {
      score += 12;
      factors.push({ name: 'Bedrooms (AI)', weight: 12, match: true });
    }

    // Bathroom match (10% weight)
    if (preferences.bathrooms && property.bathrooms === parseInt(preferences.bathrooms)) {
      score += 10;
      factors.push({ name: 'Bathrooms', weight: 10, match: true });
    } else if (userProfile?.preferredBathrooms === property.bathrooms) {
      score += 8;
      factors.push({ name: 'Bathrooms (AI)', weight: 8, match: true });
    }

    // Location match (10% weight)
    if (preferences.location && property.address?.toLowerCase().includes(preferences.location.toLowerCase())) {
      score += 10;
      factors.push({ name: 'Location', weight: 10, match: true });
    } else if (userProfile?.preferredLocation && property.address?.includes(userProfile.preferredLocation)) {
      score += 8;
      factors.push({ name: 'Location (AI)', weight: 8, match: true });
    }

    // Amenities match (10% weight)
    const amenityMatches = preferences.amenities.filter(amenity => 
      property[amenity] || property.amenities?.includes(amenity)
    ).length;
    const amenityScore = (amenityMatches / Math.max(1, preferences.amenities.length)) * 10;
    score += amenityScore;
    factors.push({ name: 'Amenities', weight: amenityScore, match: amenityMatches > 0 });

    const result = {
      score: Math.round(score),
      factors
    };
    console.log('Match score result:', result);
    return result;
  };

  const generateRecommendations = () => {
    console.log('generateRecommendations called');
    console.log('listings data:', listings);
    
    // Extract the actual listings array from the response
    const listingsArray = listings?.listings || listings || [];
    console.log('listingsArray:', listingsArray);
    
    if (!listingsArray || listingsArray.length === 0) {
      console.log('No listings data available');
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      console.log('Fallback timeout triggered - forcing completion');
      setLoading(false);
    }, 3000);
    
    try {
      // Simulate AI processing time (reduced from 1500ms to 500ms)
      setTimeout(() => {
        try {
          console.log('Processing recommendations...');
          const scoredProperties = listingsArray.map(property => {
            try {
              return {
                ...property,
                matchData: calculateMatchScore(property)
              };
            } catch (error) {
              console.error('Error scoring property:', property.name, error);
              return {
                ...property,
                matchData: { score: 0, factors: [] }
              };
            }
          });

          console.log('Scored properties:', scoredProperties);

          // Sort by match score and take top 8
          const topRecommendations = scoredProperties
            .sort((a, b) => b.matchData.score - a.matchData.score)
            .slice(0, 8);

          console.log('Top recommendations:', topRecommendations);
          
          // Ensure we have recommendations, even if scores are low
          if (topRecommendations.length === 0) {
            console.log('No recommendations generated, showing all properties');
            const fallbackRecs = listingsArray.slice(0, 8);
            console.log('Setting fallback recommendations:', fallbackRecs);
            setRecommendations(fallbackRecs);
          } else {
            console.log('Setting top recommendations:', topRecommendations);
            setRecommendations(topRecommendations);
          }
          
          console.log('Setting loading to false');
          setLoading(false);
          clearTimeout(fallbackTimeout);
        } catch (error) {
          console.error('Error in recommendation generation:', error);
          setLoading(false);
          clearTimeout(fallbackTimeout);
        }
      }, 500);
    } catch (error) {
      console.error('Error setting up recommendation generation:', error);
      setLoading(false);
    }
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setPreferences(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePriorityChange = (priority) => {
    setPreferences(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority]
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const isFavorite = (propertyId) => {
    if (!favorites || !Array.isArray(favorites)) return false;
    return favorites.some(fav => fav._id === propertyId) || false;
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="text-center text-white">
          <div className="spinner-border text-light mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Loading Smart Recommendations...</h4>
        </div>
      </div>
    );
  }
  
  if (listingsError) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <h5>Error Loading Listings</h5>
          <p>{listingsError?.data?.message || listingsError?.message || 'Failed to load listings'}</p>
        </Alert>
      </Container>
    );
  }
  
  if (favoritesError) {
    console.warn('Favorites error:', favoritesError);
    // Don't block the component if favorites fail to load
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateX(-100px) translateY(-100px) rotate(0deg); }
          100% { transform: translateX(100px) translateY(100px) rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes glow {
          0% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3)); }
          100% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
      <div className="min-vh-100" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s infinite linear',
        zIndex: 0
      }} />
      
      <Container className="mt-4" style={{ position: 'relative', zIndex: 1 }}>
        <Row className="mb-5">
          <Col>
            <div className="text-center text-white mb-4 fade-in-up">
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '30px',
                padding: '2rem',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h1 className="display-4 fw-bold mb-3" style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(45deg, #fff, #f8f9fa, #ffd700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'pulse 2s infinite'
                }}>
                  <Lightbulb className="me-3" style={{ 
                    color: '#ffd700',
                    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
                    animation: 'glow 2s infinite alternate'
                  }} />
                  Smart Property Recommendations
                </h1>
                <p className="lead text-light mb-4" style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  fontSize: '1.2rem'
                }}>
                  🎯 AI-powered property matching based on your preferences and behavior
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <Badge bg="warning" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                    ✨ AI-Powered
                  </Badge>
                  <Badge bg="info" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                    🎯 Personalized
                  </Badge>
                  <Badge bg="success" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                    🚀 Smart Matching
                  </Badge>
                </div>
              </div>
            </div>
          </Col>
        </Row>

      {/* User Profile Display */}
      {userProfile && (
        <div className="mb-4">
          <div className="card border-0 shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Decorative gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)'
            }} />
            <div className="card-body p-4" style={{ position: 'relative', zIndex: 1 }}>
              <div className="d-flex align-items-center mb-4">
                <div className="me-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  🤖
                </div>
                <div>
                  <h5 className="mb-1 fw-bold text-dark" style={{ fontSize: '1.3rem' }}>
                    AI Profile Analysis
                  </h5>
                  <p className="mb-0 text-muted" style={{ fontSize: '1rem' }}>
                    Based on your {favorites?.length || 0} saved properties
                  </p>
                </div>
              </div>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 rounded" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <div className="me-3">
                      <House className="text-primary" size={24} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Preferred Type</small>
                      <strong className="text-dark">{userProfile.preferredType}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 rounded" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <div className="me-3">
                      <CurrencyDollar className="text-success" size={24} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Price Range</small>
                      <strong className="text-dark">{formatPrice(userProfile.priceRange.min)} - {formatPrice(userProfile.priceRange.max)}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center p-3 rounded" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <div className="me-3">
                      <span className="text-primary">🛏️</span>
                    </div>
                    <div>
                      <small className="text-muted d-block">Bedrooms</small>
                      <strong className="text-dark">{userProfile.preferredBedrooms}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center p-3 rounded" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <div className="me-3">
                      <span className="text-primary">🚿</span>
                    </div>
                    <div>
                      <small className="text-muted d-block">Bathrooms</small>
                      <strong className="text-dark">{userProfile.preferredBathrooms}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center p-3 rounded" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                    <div className="me-3">
                      <GeoAlt className="text-warning" size={24} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Location</small>
                      <strong className="text-dark">{userProfile.preferredLocation}</strong>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <Badge bg="success" className="px-3 py-2" style={{ fontSize: '0.9rem', borderRadius: '20px' }}>
                  <ArrowUp className="me-1" />
                  {userProfile.confidence}% Confidence
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      <Row>
        <Col lg={4}>
          <div className="card border-0 shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>
            <div className="card-header border-0" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1.5rem'
            }}>
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <Lightbulb className="me-2" />
                Your Preferences
              </h5>
            </div>
            <div className="card-body p-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Price Range</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min Price"
                        value={preferences.priceRange.min}
                        onChange={(e) => handlePreferenceChange('priceRange', {
                          ...preferences.priceRange,
                          min: e.target.value
                        })}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max Price"
                        value={preferences.priceRange.max}
                        onChange={(e) => handlePreferenceChange('priceRange', {
                          ...preferences.priceRange,
                          max: e.target.value
                        })}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select
                    value={preferences.propertyType}
                    onChange={(e) => handlePreferenceChange('propertyType', e.target.value)}
                  >
                    <option value="">Any Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Select
                        value={preferences.bedrooms}
                        onChange={(e) => handlePreferenceChange('bedrooms', e.target.value)}
                      >
                        <option value="">Any</option>
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Select
                        value={preferences.bathrooms}
                        onChange={(e) => handlePreferenceChange('bathrooms', e.target.value)}
                      >
                        <option value="">Any</option>
                        {[1,1.5,2,2.5,3,3.5,4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City, neighborhood, or area"
                    value={preferences.location}
                    onChange={(e) => handlePreferenceChange('location', e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Desired Amenities</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {amenities.map(amenity => (
                      <Form.Check
                        key={amenity}
                        type="checkbox"
                        id={amenity}
                        label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                        checked={preferences.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="mb-1"
                      />
                    ))}
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={generateRecommendations}
                  disabled={loading}
                  className="w-100 py-3 fw-bold"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '15px',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      🤖 Analyzing...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="me-2" />
                      ✨ Get Smart Recommendations
                    </>
                  )}
                </Button>
              </Form>
            </div>
          </div>
        </Col>

        <Col lg={8}>
          {console.log('Render check - recommendations.length:', recommendations.length)}
          {console.log('Render check - recommendations:', recommendations)}
          {recommendations.length > 0 ? (
            <div>
              <div className="text-center mb-5">
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '25px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                  marginBottom: '2rem'
                }}>
                  <h3 className="text-white fw-bold mb-3" style={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    fontSize: '1.8rem',
                    background: 'linear-gradient(45deg, #fff, #ffd700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    🎯 Your Personalized Recommendations
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <Badge bg="warning" className="px-4 py-2" style={{ 
                      fontSize: '1.1rem', 
                      borderRadius: '25px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      {recommendations.length} Properties Found
                    </Badge>
                    <Badge bg="info" className="px-4 py-2" style={{ 
                      fontSize: '1.1rem', 
                      borderRadius: '25px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      ✨ AI Matched
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Row>
                {recommendations.map((property, index) => {
                  console.log('Rendering property:', property.name, 'imageUrls:', property.imageUrls);
                  return (
                  <Col key={property._id} lg={6} className="mb-4">
                    <div className="card border-0 shadow-lg h-100" style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '25px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                    }}>
                      {/* Decorative gradient overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                        zIndex: 1
                      }} />
                      <div className="position-relative">
                        <img
                          src={property.imageUrls?.[0] || 'https://via.placeholder.com/400x200/6c757d/ffffff?text=Property+Image'}
                          alt={property.name}
                          style={{ 
                            height: '250px', 
                            objectFit: 'cover',
                            width: '100%'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x200/6c757d/ffffff?text=Property+Image';
                          }}
                        />
                        <div className="position-absolute top-0 end-0 p-3">
                          <Badge 
                            bg={getScoreColor(property.matchData.score)} 
                            className="px-3 py-2 fw-bold"
                            style={{ 
                              fontSize: '0.9rem',
                              borderRadius: '20px',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                          >
                            {property.matchData.score}% Match
                          </Badge>
                        </div>
                        <div className="position-absolute top-0 start-0 p-3">
                          <Badge 
                            bg="dark" 
                            className="px-3 py-2 fw-bold"
                            style={{ 
                              fontSize: '0.9rem',
                              borderRadius: '20px',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                          >
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                      <div className="card-body p-4">
                        <h5 className="card-title fw-bold text-dark mb-2">{property.name}</h5>
                        <p className="text-muted small mb-3 d-flex align-items-center">
                          <GeoAlt className="me-1" size={16} />
                          {property.address}
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <div className="fw-bold text-primary fs-4">
                              {formatPrice(property.regularPrice)}
                            </div>
                            <div className="small text-muted d-flex align-items-center">
                              <span className="me-2">🛏️ {property.bedrooms} bed</span>
                              <span>🚿 {property.bathrooms} bath</span>
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="small text-muted d-flex align-items-center">
                              <span>📐 {property.sqft?.toLocaleString()} sq ft</span>
                            </div>
                          </div>
                        </div>

                        {/* Match Factors */}
                        <div className="mb-4">
                          <small className="text-muted fw-bold">Match factors:</small>
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {property.matchData.factors.slice(0, 3).map((factor, idx) => (
                              <Badge
                                key={idx}
                                bg={factor.match ? 'success' : 'secondary'}
                                className="px-3 py-1"
                                style={{ 
                                  fontSize: '0.8rem',
                                  borderRadius: '15px'
                                }}
                              >
                                {factor.name}
                              </Badge>
                            ))}
                            {property.matchData.factors.length > 3 && (
                              <Badge bg="light" text="dark" className="px-3 py-1" style={{ 
                                fontSize: '0.8rem',
                                borderRadius: '15px'
                              }}>
                                +{property.matchData.factors.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as={Link}
                            to={`/listing/${property._id}`}
                            className="flex-fill fw-bold"
                            style={{
                              borderRadius: '10px',
                              border: '2px solid #667eea',
                              color: '#667eea',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#667eea';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'transparent';
                              e.target.style.color = '#667eea';
                            }}
                          >
                            👁️ View Details
                          </Button>
                          <Button
                            size="sm"
                            variant={isFavorite(property._id) ? "warning" : "outline-warning"}
                            disabled={isFavorite(property._id)}
                            className="fw-bold"
                            style={{
                              borderRadius: '10px',
                              minWidth: '50px'
                            }}
                          >
                            {isFavorite(property._id) ? (
                              <StarFill size={18} />
                            ) : (
                              <Star size={18} />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                  );
                })}
              </Row>
            </div>
          ) : (
            <div className="card border-0 shadow-lg" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}>
                    <Lightbulb size={40} className="text-white" />
                  </div>
                </div>
                <h4 className="text-dark fw-bold mb-3">Get Personalized Recommendations</h4>
                <p className="text-muted lead">
                  Set your preferences and let AI find the perfect properties for you
                </p>
                {loading && (
                  <div className="mt-4">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted fw-bold">🤖 Analyzing your preferences...</p>
                  </div>
                )}
                {recommendations.length === 0 && !loading && (
                  <div className="mt-4">
                    <p className="text-info fw-bold">✨ Click "Get Smart Recommendations" to start</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
    </div>
    </>
  );
};

export default SmartRecommendations;
