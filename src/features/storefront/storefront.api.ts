import axios from "axios";
import type { ApiResponse } from "../auth/auth.types";
import type {
  CheckoutPayload,
  CheckoutResponse,
  GalleryProduct,
  PlaceOrderPayload,
  PlaceOrderResponse,
  StorefrontCategory,
  StorefrontProduct,
} from "./storefront.types";

const storefrontClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

type StorefrontProductsResponse = Omit<
  ApiResponse<StorefrontProduct[]>,
  "meta"
> & {
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    timezone?: string;
    timezoneOffset?: string;
    serverTime?: string;
  };
};

const STOREFRONT_PAGE_SIZE = 100;

export async function getStorefrontProducts(storeId: string) {
  const firstPage = await storefrontClient.get<StorefrontProductsResponse>(
    "/public/products",
    { params: { storeId, page: 1, pageSize: STOREFRONT_PAGE_SIZE } },
  );

  const totalPages = firstPage.data.meta?.totalPages ?? 1;
  if (totalPages <= 1) return firstPage.data.data;

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      storefrontClient.get<StorefrontProductsResponse>("/public/products", {
        params: {
          storeId,
          page: index + 2,
          pageSize: STOREFRONT_PAGE_SIZE,
        },
      }),
    ),
  );

  return [
    ...firstPage.data.data,
    ...remainingPages.flatMap((response) => response.data.data),
  ];
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

/**
 * Places an order via the public orders endpoint.
 * Called when the customer clicks "Pay" on the checkout page.
 */
export async function placeOrder(
  payload: PlaceOrderPayload,
): Promise<PlaceOrderResponse> {
  const response = await storefrontClient.post<{
    success: boolean;
    data: PlaceOrderResponse;
    message: string;
  }>("/public/orders", payload);

  if (!response.data.success) {
    throw new Error(response.data.message ?? "Failed to place order.");
  }
  return response.data.data;
}
