import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FunnelStage } from '../types/analytics';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

interface ConversionFunnelProps {
  data: FunnelStage[];
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 min-w-0 overflow-hidden">
      <h3 className="mb-3 md:mb-4 text-sm md:text-base">Conversion Funnel</h3>
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-gray-500">
          No funnel data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              stroke="#9ca3af" 
              fontSize={12}
              tickMargin={8}
            />
            <YAxis 
              dataKey="stage" 
              type="category" 
              width={100} 
              stroke="#9ca3af" 
              fontSize={11}
              tickMargin={8}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value.toLocaleString()} (${props.payload.percentage}%)`,
                'Count'
              ]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}