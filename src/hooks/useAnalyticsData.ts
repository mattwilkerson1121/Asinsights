import { useState, useEffect } from 'react';
import type { AnalyticsData, DateRange } from '../types/analytics';
import { fetchAnalyticsData } from '../services/analyticsService';

/**
 * Custom hook for fetching analytics data
 * Automatically refetches when date range changes
 */
export function useAnalyticsData(dateRange: DateRange) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const analyticsData = await fetchAnalyticsData(dateRange);
        
        if (isMounted) {
          setData(analyticsData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [dateRange.start, dateRange.end]);

  return { data, loading, error };
}
