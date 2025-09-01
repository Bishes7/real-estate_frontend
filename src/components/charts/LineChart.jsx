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

const LineChartComponent = ({ data }) => {
  const formattedData =
    data?.map((item) => ({
      week: `Week ${item._id.split("-")[1]}`, // Extract week number from "2025-08"
      count: item.count,
    })) || [];

  return (
    <div className="p-3 shadow-sm bg-white rounded" style={{ height: 300 }}>
      <h6 className="fw-bold text-secondary mb-2">New Users per Week</h6>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#ffc107"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
