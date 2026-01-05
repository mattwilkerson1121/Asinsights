import type { AnalyticsData } from '../types/analytics';

/**
 * Generate mock data variations based on query context
 * This simulates updated data based on AI chatbot queries
 */
export function generateUpdatedMockData(query: string, baseData: AnalyticsData | null): AnalyticsData {
  if (!baseData) {
    // Return default data if no base data exists
    return getDefaultData();
  }

  const lowerQuery = query.toLowerCase();
  
  // Create a copy of the base data
  const updatedData = JSON.parse(JSON.stringify(baseData)) as AnalyticsData;

  // Simulate data changes based on query type
  if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
    // Slightly update revenue data
    updatedData.kpis.revenue.change = updatedData.kpis.revenue.change + 2.5;
    updatedData.kpis.revenue.trend = updatedData.kpis.revenue.change > 0 ? 'up' : 'down';
    
    // Update revenue chart with slight variations
    updatedData.revenueData = updatedData.revenueData.map(point => ({
      ...point,
      revenue: Math.round(point.revenue * (1 + (Math.random() * 0.1 - 0.05))),
    }));
  }
  
  if (lowerQuery.includes('conversion') || lowerQuery.includes('rate')) {
    // Update conversion rate
    const newChange = updatedData.kpis.conversionRate.change + (Math.random() * 2 - 1);
    updatedData.kpis.conversionRate.change = Math.round(newChange * 10) / 10;
    updatedData.kpis.conversionRate.trend = updatedData.kpis.conversionRate.change > 0 ? 'up' : 'down';
    
    // Update funnel data
    updatedData.funnelData = updatedData.funnelData.map((stage, idx) => ({
      ...stage,
      value: Math.round(stage.value * (1 + (Math.random() * 0.08 - 0.04))),
    }));
    
    // Recalculate percentages
    const baseValue = updatedData.funnelData[0].value;
    updatedData.funnelData = updatedData.funnelData.map((stage) => ({
      ...stage,
      percentage: Math.round((stage.value / baseValue) * 1000) / 10,
    }));
  }
  
  if (lowerQuery.includes('product') || lowerQuery.includes('top')) {
    // Update product performance
    updatedData.topProducts = updatedData.topProducts.map(product => {
      const trendChange = Math.random() * 4 - 2;
      return {
        ...product,
        trend: Math.round((product.trend + trendChange) * 10) / 10,
      };
    });
  }
  
  if (lowerQuery.includes('traffic') || lowerQuery.includes('source')) {
    // Update traffic sources
    const total = 100;
    const variation = updatedData.trafficSources.map(() => Math.random());
    const sum = variation.reduce((a, b) => a + b, 0);
    
    updatedData.trafficSources = updatedData.trafficSources.map((source, idx) => ({
      ...source,
      value: Math.round((variation[idx] / sum) * total),
    }));
  }

  return updatedData;
}

function getDefaultData(): AnalyticsData {
  return {
    kpis: {
      revenue: { value: '$124,583', change: 12.5, trend: 'up' },
      orders: { value: '1,428', change: 8.3, trend: 'up' },
      conversionRate: { value: '3.24%', change: -2.1, trend: 'down' },
      avgOrderValue: { value: '$87.23', change: 5.6, trend: 'up' },
    },
    revenueData: [
      { date: 'Nov 5', revenue: 4200, orders: 52 },
      { date: 'Nov 8', revenue: 5100, orders: 61 },
      { date: 'Nov 11', revenue: 4800, orders: 58 },
      { date: 'Nov 14', revenue: 6200, orders: 74 },
      { date: 'Nov 17', revenue: 5500, orders: 65 },
      { date: 'Nov 20', revenue: 7100, orders: 83 },
      { date: 'Nov 23', revenue: 6800, orders: 79 },
      { date: 'Nov 26', revenue: 8200, orders: 95 },
      { date: 'Nov 29', revenue: 7500, orders: 88 },
      { date: 'Dec 2', revenue: 9100, orders: 102 },
      { date: 'Dec 5', revenue: 8600, orders: 98 },
    ],
    funnelData: [
      { stage: 'Sessions', value: 44123, percentage: 100 },
      { stage: 'Product Views', value: 28450, percentage: 64 },
      { stage: 'Add to Cart', value: 8834, percentage: 20 },
      { stage: 'Checkout', value: 2210, percentage: 5 },
      { stage: 'Purchase', value: 1428, percentage: 3.2 },
    ],
    topProducts: [
      { name: 'Wireless Headphones Pro', revenue: '$12,450', orders: 142, trend: 15.2 },
      { name: 'Smart Watch Series 5', revenue: '$9,820', orders: 98, trend: 8.7 },
      { name: 'Laptop Stand Premium', revenue: '$7,340', orders: 156, trend: -3.2 },
      { name: 'USB-C Hub Adapter', revenue: '$6,120', orders: 204, trend: 22.4 },
      { name: 'Mechanical Keyboard RGB', revenue: '$5,890', orders: 67, trend: 5.1 },
    ],
    trafficSources: [
      { name: 'Organic Search', value: 35, color: '#3b82f6' },
      { name: 'Direct', value: 25, color: '#10b981' },
      { name: 'Social Media', value: 20, color: '#8b5cf6' },
      { name: 'Paid Ads', value: 15, color: '#f59e0b' },
      { name: 'Referral', value: 5, color: '#ef4444' },
    ],
  };
}
