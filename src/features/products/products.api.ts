import { apiClient } from '../../lib/axios'
import type { ApiResponse } from '../auth/auth.types'
import type {
  CategoryApiResponse,
  CreateProductPayload,
  InventoryItemResponse,
  Product,
  ProductDetail,
} from './products.types'

// ── Products ────────────────────────────────────────────────────────────────

export async function getProducts(storeId: string): Promise<Product[]> {
  const response = await apiClient.get<ApiResponse<Product[]>>(
    '/inventory/items',
    { params: { storeId } },
  )
  return response.data.data
}

export async function getProductById(
  productId: string,
  storeId: string,
): Promise<ProductDetail> {
  const response = await apiClient.get<ApiResponse<ProductDetail>>(
    `/inventory/products/${productId}`,
    { params: { storeId } },
  )
  return response.data.data
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<ProductDetail> {
  const response = await apiClient.post<ApiResponse<ProductDetail>>(
    '/inventory/products',
    payload,
  )
  return response.data.data
}

export async function updateProduct(
  productId: string,
  payload: Partial<CreateProductPayload>,
): Promise<ProductDetail> {
  const response = await apiClient.patch<ApiResponse<ProductDetail>>(
    `/inventory/products/${productId}`,
    payload,
  )
  return response.data.data
}

export async function deleteProduct(
  productId: string,
  storeId: string,
): Promise<void> {
  await apiClient.delete(`/inventory/products/${productId}`, {
    params: { storeId },
  })
}

// ── Inventory Items ─────────────────────────────────────────────────────────

export async function getItems(
  storeId: string,
  params?: { search?: string; page?: number; pageSize?: number },
): Promise<{ data: InventoryItemResponse[]; total: number }> {
  const response = await apiClient.get<ApiResponse<InventoryItemResponse[]>>(
    '/inventory/items',
    { params: { storeId, ...params } },
  )
  return {
    data: response.data.data,
    total: response.data.meta?.pagination?.total ?? response.data.data.length,
  }
}

export function mapItemToProduct(item: InventoryItemResponse): Product {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    category: item.category ?? item.categoryRef?.name ?? '',
    barcode: item.barcode ?? '',
    buyingPrice: Number(item.costPrice ?? 0),
    sellingPrice: Number(item.sellingPrice ?? 0),
    stockQuantity: Number(item.itemsInStock ?? 0),
    lowStockThreshold: Number(item.lowStockThreshold ?? 5),
    photoUrl: item.photoUrl ?? '',
    expiryDate: item.expiryDate ?? '',
    createdDate: item.createdAt?.split('T')[0] ?? '',
  }
}

// ── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(
  storeId: string,
  params?: { search?: string; page?: number; pageSize?: number },
): Promise<{ data: CategoryApiResponse[]; total: number }> {
  const response = await apiClient.get<ApiResponse<CategoryApiResponse[]>>(
    '/inventory/categories',
    { params: { storeId, ...params } },
  )
  return {
    data: response.data.data,
    total: response.data.meta?.pagination?.total ?? response.data.data.length,
  }
}

export async function createCategory(
  storeId: string,
  name: string,
): Promise<CategoryApiResponse> {
  const response = await apiClient.post<ApiResponse<CategoryApiResponse>>(
    '/inventory/categories',
    { storeId, name },
  )
  return response.data.data
}

export async function updateCategory(
  categoryId: string,
  storeId: string,
  name: string,
): Promise<CategoryApiResponse> {
  const response = await apiClient.patch<ApiResponse<CategoryApiResponse>>(
    `/inventory/categories/${categoryId}`,
    { storeId, name },
  )
  return response.data.data
}


export async function deleteCategory(
  categoryId: string,
  storeId: string,
): Promise<void> {
  await apiClient.delete(`/inventory/categories/${categoryId}`, {
    params: { storeId },
  })
}
