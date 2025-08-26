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
import { getMonthName } from "../../utils/months";

const BarChartComponent = ({ data }) => {
  const formattedData =
    data?.map((item) => ({
      month: getMonthName(item._id),
      count: item.count,
    })) || [];

  return (
    <div className="p-3 shadow-sm bg-white rounded" style={{ height: 300 }}>
      <h6 className="fw-bold text-secondary mb-2">Listings per Month</h6>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#17a2b8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
