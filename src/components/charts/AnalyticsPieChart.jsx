import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AnalyticsPieChart = ({ data, title = "Chart" }) => {
  const formattedData = data?.map((item, index) => ({
    name: item._id || item.name || "Unknown",
    value: item.count || item.value || 0,
    color: COLORS[index % COLORS.length],
  })) || [];

  return (
    <div className="p-3 bg-white shadow rounded" style={{ height: 300 }}>
      <h6 className="fw-bold text-secondary mb-2">{title}</h6>
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
          <Tooltip formatter={(value, name) => [`${value}`, name]} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsPieChart;
