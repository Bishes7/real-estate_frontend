import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useGetStatsQuery } from "../../slices/adminApiSLice";
import PieChartComponent from "../../components/charts/PieChart";
import BarChartComponent from "../../components/charts/BarChart";
import LineChartComponent from "../../components/charts/LineChart";

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useGetStatsQuery();

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (error)
    return <p className="text-center text-danger mt-4">Error fetching stats</p>;

  return (
    <Container fluid className="my-4">
      <div className="mb-3">
        <h4 className="fw-bold">Admin Dashboard</h4>
        <p className="text-muted mb-0">Key insights of your platform</p>
      </div>
      <Row className="g-4">
        <Col md={4}>
          <PieChartComponent data={stats?.listingsByType} />
        </Col>
        <Col md={4}>
          <BarChartComponent data={stats?.listingsByMonth} />
        </Col>
        <Col md={4}>
          <LineChartComponent data={stats?.usersByWeek} />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
