import { KPICard } from './KPICard';
import { RevenueChart } from './RevenueChart';
import { ConversionFunnel } from './ConversionFunnel';
import { TopProducts } from './TopProducts';
import { TrafficSources } from './TrafficSources';
import { DollarSign, ShoppingCart, TrendingUp, Users, Loader2 } from 'lucide-react';
import type { AnalyticsData, DateRange } from '../types/analytics';

interface DashboardProps {
  data: AnalyticsData | null;
  loading: boolean;
  error: Error | null;
  dateRange: DateRange;
}

export function Dashboard({ data, loading, error }: DashboardProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 mb-2">Error loading analytics data</p>
            <p className="text-red-600 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 max-w-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <KPICard
          title="Total Revenue"
          value={data.kpis.revenue.value}
          change={data.kpis.revenue.change}
          trend={data.kpis.revenue.trend}
          icon={<DollarSign size={20} />}
          color="blue"
        />
        <KPICard
          title="Orders"
          value={data.kpis.orders.value}
          change={data.kpis.orders.change}
          trend={data.kpis.orders.trend}
          icon={<ShoppingCart size={20} />}
          color="green"
        />
        <KPICard
          title="Conversion Rate"
          value={data.kpis.conversionRate.value}
          change={data.kpis.conversionRate.change}
          trend={data.kpis.conversionRate.trend}
          icon={<TrendingUp size={20} />}
          color="purple"
        />
        <KPICard
          title="Avg Order Value"
          value={data.kpis.avgOrderValue.value}
          change={data.kpis.avgOrderValue.change}
          trend={data.kpis.avgOrderValue.trend}
          icon={<Users size={20} />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <RevenueChart data={data.revenueData} />
        <ConversionFunnel data={data.funnelData} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <TopProducts products={data.topProducts} />
        <TrafficSources sources={data.trafficSources} />
      </div>
    </div>
  );
}