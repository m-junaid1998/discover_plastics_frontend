import { useGetQuery, useLazyGetQuery, useCrudMutation, useUploadMutation } from "../api/apiSlice";
import { endpoints } from "../api/config";
import { useApiHandler, type ApiHandlerOptions } from "../api/useApiHandler";
import type { PaginationParams } from "./Pagination/usePaginationParams";

export const useProduct = (params?: PaginationParams) => {
  const [crudMutation, { isLoading: isCrudLoading }] = useCrudMutation();
  const [uploadMutation, { isLoading: isUploadLoading }] = useUploadMutation();
  const [triggerGetProducts, { isLoading: isProductLazyLoading }] = useLazyGetQuery();
  
  const [triggerGetProductById] = useLazyGetQuery();
  const [triggerGetTopRated] = useLazyGetQuery();
  const [triggerGetBestSellers] = useLazyGetQuery();
  const [triggerGetRelated] = useLazyGetQuery();

  const { handleApiCall } = useApiHandler();

  const isProductMutationLoading = isCrudLoading || isUploadLoading;

  const queryResult = useGetQuery(
    { endpoint: endpoints.productRoutes.getAll, params },
    { skip: !params, refetchOnFocus: true }
  );

  const { refetch } = queryResult;

  const exec = async (
    endpoint: string,
    method: "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    isUpload = false,
    options?: ApiHandlerOptions
  ) => {
    const mutation = isUpload ? uploadMutation : crudMutation;
    const res = await handleApiCall(
      mutation({ endpoint, method, data }).unwrap(),
      options
    );
    if (res?.success) refetch();
    return res;
  };

  return {
    productsQuery: queryResult,
    products: queryResult.data?.data || [],
    pagination: queryResult.data?.pagination || null,
    isLoadingProducts: queryResult.isLoading,
    refetchProducts: refetch,
    isProductMutationLoading,
    isProductLazyLoading,

    getProducts: (customParams?: PaginationParams, options?: ApiHandlerOptions) =>
      handleApiCall(
        triggerGetProducts({
          endpoint: endpoints.productRoutes.getAll,
          params: customParams || params,
        }).unwrap(),
        { errorMessage: "Failed to fetch products.", ...options }
      ),

    getProductById: (id: string | number, options?: ApiHandlerOptions) =>
      handleApiCall(
        triggerGetProductById({
          endpoint: endpoints.productRoutes.getById(id),
        }).unwrap(),
        { errorMessage: "Failed to fetch product details.", ...options }
      ),

    getTopRatedProducts: (limit: number = 10, options?: ApiHandlerOptions) =>
      handleApiCall(
        triggerGetTopRated({
          endpoint: endpoints.productRoutes.getTopRated,
          params: { limit },
        }).unwrap(),
        { errorMessage: "Failed to fetch top rated products.", ...options }
      ),

    getBestSellerProducts: (limit: number = 10, options?: ApiHandlerOptions) =>
      handleApiCall(
        triggerGetBestSellers({
          endpoint: endpoints.productRoutes.getBestSellers,
          params: { limit },
        }).unwrap(),
        { errorMessage: "Failed to fetch best sellers.", ...options }
      ),

    getRelatedProducts: (id: string | number, options?: ApiHandlerOptions) =>
      handleApiCall(
        triggerGetRelated({
          endpoint: endpoints.productRoutes.getRelated(id),
        }).unwrap(),
        { errorMessage: "Failed to fetch related products.", ...options }
      ),

    createProduct: (data: FormData | Record<string, any>, options?: ApiHandlerOptions) =>
      exec(endpoints.productRoutes.create, "POST", data, true, {
        successMessage: "Product created successfully.",
        errorMessage: "Failed to create product.",
        ...options,
      }),

    updateProduct: (id: string | number, data: FormData | Record<string, any>, options?: ApiHandlerOptions) =>
      exec(endpoints.productRoutes.update(id), "PUT", data, true, {
        successMessage: "Product updated successfully.",
        errorMessage: "Failed to update product.",
        ...options,
      }),

    deleteProduct: (id: string | number, options?: ApiHandlerOptions) =>
      exec(endpoints.productRoutes.delete(id), "DELETE", undefined, false, {
        successMessage: "Product deleted successfully.",
        errorMessage: "Failed to delete product.",
        ...options,
      }),

    deleteAllProducts: (options?: ApiHandlerOptions) =>
      exec(endpoints.productRoutes.deleteAll, "DELETE", undefined, false, {
        successMessage: "All products deleted successfully.",
        errorMessage: "Failed to delete all products.",
        ...options,
      }),

    togglePublishStatus: (id: string | number | (string | number)[], options?: ApiHandlerOptions) => {
      const targetIds = Array.isArray(id) ? id : [id];
      return exec(endpoints.productRoutes.patch, "PATCH", { id: targetIds }, false, {
        successMessage: options?.successMessage || "Publish status updated.",
        errorMessage: "Failed to update status.",
        ...options,
      });
    },
  };
};