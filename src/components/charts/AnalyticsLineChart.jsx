import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AnalyticsLineChart = ({ data, title = "Chart" }) => {
  const formattedData = data?.map((item) => ({
    date: item._id || item.date || "Unknown",
    views: item.totalViews || item.views || 0,
    listings: item.listingsCount || item.listings || 0,
  })) || [];

  return (
    <div className="p-3 shadow-sm bg-white rounded" style={{ height: 300 }}>
      <h6 className="fw-bold text-secondary mb-2">{title}</h6>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#8884d8"
            strokeWidth={2}
            name="Views"
          />
          <Line
            type="monotone"
            dataKey="listings"
            stroke="#82ca9d"
            strokeWidth={2}
            name="Listings"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsLineChart;
