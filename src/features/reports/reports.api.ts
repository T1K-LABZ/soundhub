import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/axios'
import type { RevenueSummary } from './reports.types'

const revenueSummaryQueryKey = ['reports', 'revenue-summary'] as const

export async function getRevenueSummary(): Promise<RevenueSummary[]> {
  const response = await apiClient.get<RevenueSummary[]>('/reports/revenue')

  return response.data
}

export function useRevenueSummaryQuery() {
  return useQuery({
    queryKey: revenueSummaryQueryKey,
    queryFn: getRevenueSummary,
  })
}
