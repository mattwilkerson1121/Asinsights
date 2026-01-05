import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { TrafficSource } from '../types/analytics';

interface TrafficSourcesProps {
  sources: TrafficSource[];
}

export function TrafficSources({ sources }: TrafficSourcesProps) {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 min-w-0 overflow-hidden">
      <h3 className="mb-3 md:mb-4 text-sm md:text-base">Traffic Sources</h3>
      
      {sources.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No traffic data available
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ResponsiveContainer width="100%" height={200} className="sm:w-3/5">
            <PieChart>
              <Pie
                data={sources}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {sources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="w-full sm:flex-1 space-y-2 md:space-y-3">
            {sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-xs md:text-sm text-gray-700 truncate">{source.name}</span>
                </div>
                <span className="text-xs md:text-sm flex-shrink-0">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}