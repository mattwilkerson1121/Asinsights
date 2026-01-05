import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { RevenueDataPoint } from '../types/analytics';

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 min-w-0 overflow-hidden">
      <h3 className="mb-3 md:mb-4 text-sm md:text-base">Revenue Trends</h3>
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-gray-500">
          No revenue data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af" 
              fontSize={12}
              tickMargin={8}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12}
              tickMargin={8}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Revenue ($)"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}