// Types for Google Analytics Data API responses

export interface KPIData {
  value: string;
  change: number;
  trend: 'up' | 'down';
}

export interface KPIs {
  revenue: KPIData;
  orders: KPIData;
  conversionRate: KPIData;
  avgOrderValue: KPIData;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface FunnelStage {
  stage: string;
  value: number;
  percentage: number;
}

export interface Product {
  name: string;
  revenue: string;
  orders: number;
  trend: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsData {
  kpis: KPIs;
  revenueData: RevenueDataPoint[];
  funnelData: FunnelStage[];
  topProducts: Product[];
  trafficSources: TrafficSource[];
}

export interface DateRange {
  start: string;
  end: string;
}
