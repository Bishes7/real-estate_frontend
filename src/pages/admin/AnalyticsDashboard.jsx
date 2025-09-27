import React from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { useGetAdvancedAnalyticsQuery } from "../../slices/adminApiSLice";
import AnalyticsBarChart from "../../components/charts/AnalyticsBarChart";
import AnalyticsLineChart from "../../components/charts/AnalyticsLineChart";
import AnalyticsPieChart from "../../components/charts/AnalyticsPieChart";

const AnalyticsDashboard = () => {
  const { data, isLoading, error } = useGetAdvancedAnalyticsQuery();

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;

  console.log("Analytics Data:", data);

  const {
    topListings = [],
    viewsOverTime = [],
    userEngagement = [],
    bookingStats = [],
    propertyTypeStats = []
  } = data || {};

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Advanced Analytics Dashboard</h2>
      
      {/* Top Performing Listings */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h5>Top Performing Listings</h5>
            </Card.Header>
            <Card.Body>
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th>Listing Name</th>
                    <th>Views</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {topListings.length > 0 ? topListings.map((listing, index) => (
                    <tr key={listing._id}>
                      <td>{listing.name}</td>
                      <td>{listing.views || 0}</td>
                      <td>
                        <span className={`badge ${listing.type === 'rent' ? 'bg-info' : 'bg-success'}`}>
                          {listing.type}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header>
              <h5>Property Type Performance</h5>
            </Card.Header>
            <Card.Body>
              {propertyTypeStats.length > 0 ? (
                <AnalyticsPieChart 
                  title="Property Types"
                  data={propertyTypeStats}
                />
              ) : (
                <div className="p-3 text-center">
                  <p>No property type data available</p>
                  <small className="text-muted">Create some listings to see analytics</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Views Over Time */}
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>Views Over Time (Last 30 Days)</h5>
            </Card.Header>
            <Card.Body>
              {viewsOverTime.length > 0 ? (
                <AnalyticsLineChart 
                  title="Views Over Time"
                  data={viewsOverTime}
                />
              ) : (
                <div className="p-3 text-center">
                  <p>No views data available</p>
                  <small className="text-muted">Views will appear as users browse listings</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Booking Status</h5>
            </Card.Header>
            <Card.Body>
              {bookingStats.length > 0 ? (
                <AnalyticsBarChart 
                  title="Booking Status"
                  data={bookingStats}
                />
              ) : (
                <div className="p-3 text-center">
                  <p>No booking data available</p>
                  <small className="text-muted">Bookings will appear when users schedule tours</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Engagement */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Top Users by Engagement</h5>
            </Card.Header>
            <Card.Body>
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Listings</th>
                    <th>Total Views</th>
                  </tr>
                </thead>
                <tbody>
                  {userEngagement.length > 0 ? userEngagement.map((user, index) => (
                    <tr key={user._id}>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>{user.listingsCount}</td>
                      <td>{user.totalViews || 0}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;