"use client";

import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define a generic interface for the chart props
interface LineChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKeys: (keyof T)[];
  colors: string[];
  height: number | string;
  gradient?: boolean;
  gradientColor?: string;
  currency?: string;
}

// You can make the component generic so that it accepts any shape of data.
export function LineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKeys,
  colors,
  height,
}: LineChartProps<T>) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={String(xKey)}
            axisLine={false}
            tick={{ fill: "#6B7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280" }}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          {yKeys.map((key, index) => (
            <Line
              key={String(key)}
              type="monotone"
              dataKey={String(key)}
              stroke={colors[index]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
}
