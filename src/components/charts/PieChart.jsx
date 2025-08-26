import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#007bff", "#28a745"];

const PieChartComponent = ({ data }) => {
  const formattedData =
    data?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  return (
    <div className="p-3 shadow-sm bg-white rounded" style={{ height: 300 }}>
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
            label
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
