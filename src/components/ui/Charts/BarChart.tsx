'use client'

import React from 'react'
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// Define a generic type T for your data objects
interface BarChartProps<T extends Record<string, unknown>> {
  data: T[]
  xKey: keyof T
  yKeys: (keyof T)[]
  colors: string[]
  height?: number
  unit?: string;
  horizontal?: boolean;
  barRadius: number;
  currency: string;
  stacked?: boolean;
  gradientColor?: string;
}

export function BarChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKeys,
  colors,
  height = 300
}: BarChartProps<T>) {
  return (
    <div style={{ height }} className="[&_.recharts-cartesian-grid-vertical>line]:stroke-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xKey as string} // cast because Recharts expects a string
            axisLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#F3F4F6' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '14px'
            }}
          />
          {yKeys.map((key, index) => (
            <Bar
              key={String(key)}
              dataKey={key as string} // cast because Recharts expects a string
              fill={colors[index]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}
