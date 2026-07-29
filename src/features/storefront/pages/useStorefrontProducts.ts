import { useQuery } from "@tanstack/react-query";
import {
  getStorefrontCategories,
  getStorefrontGallery,
  getStorefrontProducts,
} from "../storefront.api";
import { storeId } from "../storefront.utils";

export function useStorefrontProducts() {
  return useQuery({
    queryKey: ["storefront-products", storeId],
    queryFn: () => getStorefrontProducts(storeId),
    enabled: !!storeId,
    staleTime: 60_000,
  });
}

export function useStorefrontGallery(category?: string) {
  return useQuery({
    queryKey: ["storefront-gallery", storeId, category],
    queryFn: () => getStorefrontGallery(storeId, category),
    enabled: !!storeId,
    staleTime: 60_000,
  });
}

export function useStorefrontCategories() {
  return useQuery({
    queryKey: ["storefront-categories", storeId],
    queryFn: () => getStorefrontCategories(storeId),
    enabled: !!storeId,
    staleTime: 60_000,
  });
}
