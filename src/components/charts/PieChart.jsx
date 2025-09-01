import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

const COLOR_MAP = {
  rent: "#007bff", // Blue
  sell: "#28a745", // Green
};

const PieChartComponent = ({ data }) => {
  const formattedData =
    data?.map((item) => {
      const key = item._id?.toLowerCase() || "unknown";
      return {
        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
        value: item.count,
        color: COLOR_MAP[key] || "#6c757d", // Default gray if type unknown
      };
    }) || [];
  console.log("Stats Data:", data);

  return (
    <div className="p-3 bg-white shadow rounded" style={{ height: 300 }}>
      <h6 className="fw-bold text-secondary mb-2">Listings by Type</h6>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: ${value}`}
            isAnimationActive={true}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} Listings`, name]} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
