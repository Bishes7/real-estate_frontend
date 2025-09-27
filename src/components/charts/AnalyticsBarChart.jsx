import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AnalyticsBarChart = ({ data, title = "Chart" }) => {
  const formattedData = data?.map((item) => ({
    name: item._id || item.name || "Unknown",
    value: item.count || item.value || 0,
  })) || [];

  return (
    <div className="p-3 shadow-sm bg-white rounded" style={{ height: 300 }}>
      <h6 className="fw-bold text-secondary mb-2">{title}</h6>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#17a2b8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsBarChart;
