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
import { getMonthName } from "../../utils/months";

const LineChartComponent = ({ data }) => {
  const formattedData =
    data?.map((item) => ({
      month: getMonthName(item._id),
      count: item.count,
    })) || [];

  return (
    <div className="p-3 shadow-sm bg-white rounded" style={{ height: 300 }}>
      <h6 className="fw-bold text-secondary mb-2">New Users per Month</h6>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
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
