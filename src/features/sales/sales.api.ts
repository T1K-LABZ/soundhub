import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/axios'
import type { Sale } from './sales.types'

const salesQueryKey = ['sales'] as const

export async function getSales(): Promise<Sale[]> {
  const response = await apiClient.get<Sale[]>('/sales')

  return response.data
}

export function useSalesQuery() {
  return useQuery({
    queryKey: salesQueryKey,
    queryFn: getSales,
  })
}
