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
import { TooltipProps } from "recharts";

// Custom tooltip function matching Recharts' expected type.
// We assume the value type is number and the name type is string.
// const customTooltip = (props: TooltipProps<number, string>) => {
//   const { active, payload, label } = props;
//   if (active && payload && payload.length) {
//     // Find the tickets and solutions values based on the dataKey
//     const tickets = payload.find((item) => item.dataKey === "tickets")?.value;
//     const solutions = payload.find((item) => item.dataKey === "solutions")?.value;

//     return (
//       <div className="bg-white p-4 rounded-xl shadow-xl border border-[#e0efff] backdrop-blur-sm">
//         <p className="text-sm font-semibold text-[#213f5b] mb-2">📌 {label}</p>
//         <div className="space-y-2">
//           <div className="flex items-center gap-3">
//             <div className="h-2.5 w-2.5 rounded-full bg-[#213f5b]" />
//             <span className="text-sm font-medium text-[#405976]">
//               Tickets: <span className="text-[#0d2840] font-bold">{tickets}</span>
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="h-2.5 w-2.5 rounded-full bg-[#d2fcb2]" />
//             <span className="text-sm font-medium text-[#405976]">
//               Solutions: <span className="text-[#0d2840] font-bold">{solutions}</span>
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// Define a generic interface for the chart props.
interface LineChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKeys?: (keyof T)[];
  colors: string[];
  height: number | string;
  gradient?: boolean;
  gradientColor?: string;
  strokeWidth?: number;
  currency?: string;
  dotRadius?: number;
  showGrid?: boolean;
  gridColor?: string;
  axisProps?: React.SVGProps<SVGLineElement>;
  xAxisFormatter?: (value: string) => string;
  tooltip?: (props: TooltipProps<number, string>) => React.ReactNode;
  className?: string; // Add this line
}

export const customTooltip = (props: TooltipProps<number, string>) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const tickets = payload.find((item) => item.dataKey === "tickets")?.value;
    const solutions = payload.find((item) => item.dataKey === "solutions")?.value;
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-[#e0efff] backdrop-blur-sm">
        <p className="text-sm font-semibold text-[#213f5b] mb-2">📌 {label}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#213f5b]" />
            <span className="text-sm font-medium text-[#405976]">
              Tickets: <span className="text-[#0d2840] font-bold">{tickets}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#d2fcb2]" />
            <span className="text-sm font-medium text-[#405976]">
              Solutions: <span className="text-[#0d2840] font-bold">{solutions}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


// You can make the component generic so that it accepts any shape of data.
export function LineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKeys = [],
  colors = [],
  height,
  tooltip,
}: LineChartProps<T>) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={String(xKey)} axisLine={false} tick={{ fill: "#6B7280" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
          <Tooltip
            content={tooltip ? tooltip : customTooltip}
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
