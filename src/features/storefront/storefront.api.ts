import axios from "axios";
import type { ApiResponse } from "../auth/auth.types";
import type {
  CheckoutPayload,
  CheckoutResponse,
  GalleryProduct,
  StorefrontCategory,
  StorefrontProduct,
} from "./storefront.types";

const storefrontClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function getStorefrontProducts(storeId: string) {
  const response = await storefrontClient.get<ApiResponse<StorefrontProduct[]>>(
    "/public/products",
    { params: { storeId } },
  );
  return response.data.data;
}

export async function getStorefrontCategories(storeId: string) {
  const response = await storefrontClient.get<
    ApiResponse<StorefrontCategory[]>
  >("/inventory/categories", { params: { storeId } });
  return response.data.data;
}

export async function getStorefrontGallery(storeId: string, category?: string) {
  const response = await storefrontClient.get<ApiResponse<GalleryProduct[]>>(
    "/public/gallery",
    { params: { storeId, ...(category ? { category } : {}) } },
  );
  return response.data.data;
}

export async function getStorefrontProduct(productId: string, storeId: string) {
  const response = await storefrontClient.get<ApiResponse<StorefrontProduct>>(
    `/public/products/${productId}`,
    { params: { storeId } },
  );
  return response.data.data;
}

export async function startMpesaCheckout(payload: CheckoutPayload) {
  const endpoint = import.meta.env.VITE_STOREFRONT_CHECKOUT_ENDPOINT;
  if (!endpoint) {
    throw new Error("M-Pesa checkout is not configured yet.");
  }

  const response = await storefrontClient.post<{ data: CheckoutResponse }>(
    endpoint,
    payload,
  );
  return response.data.data;
}
