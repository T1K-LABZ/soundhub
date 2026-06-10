import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/axios'
import type { InventoryItem } from './inventory.types'

const inventoryQueryKey = ['inventory'] as const

export async function getInventory(): Promise<InventoryItem[]> {
  const response = await apiClient.get<InventoryItem[]>('/inventory')

  return response.data
}

export function useInventoryQuery() {
  return useQuery({
    queryKey: inventoryQueryKey,
    queryFn: getInventory,
  })
}
