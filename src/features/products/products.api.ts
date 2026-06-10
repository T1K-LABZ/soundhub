import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/axios'
import type { Product } from './products.types'

const productsQueryKey = ['products'] as const

export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get<Product[]>('/products')

  return response.data
}

export function useProductsQuery() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: getProducts,
  })
}
