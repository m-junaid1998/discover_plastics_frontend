import { useGetQuery, useLazyGetQuery, useCrudMutation } from "../api/apiSlice";
import { endpoints } from "../api/config";
import { useApiHandler, type ApiHandlerOptions } from "../api/useApiHandler";

export const useWishlist = (autoFetch = true) => {
  const [crudMutation, { isLoading: isWishlistMutationLoading }] = useCrudMutation();
  const [triggerGetWishlist, { isLoading: isWishlistLazyLoading }] = useLazyGetQuery();
  const { handleApiCall } = useApiHandler();

  const queryResult = useGetQuery(endpoints.wishlistRoutes.base, {
    skip: !autoFetch,
    refetchOnFocus: true,
  });

  const { refetch: refetchWishlist } = queryResult;

  const executeWishlistRequest = async (
    endpoint: string,
    method: "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    options?: ApiHandlerOptions
  ) => {
    const res = await handleApiCall(
      crudMutation({ endpoint, method, data }).unwrap(),
      options
    );
    if (res?.success) {
      refetchWishlist();
    }
    return res;
  };

  const wishlistData = queryResult.data?.data;
  const wishlistProducts = wishlistData?.products || [];

  const toggleWishlist = (productId: string, options?: ApiHandlerOptions) =>
    executeWishlistRequest(endpoints.wishlistRoutes.base, "POST", { productId }, {
      errorMessage: "Failed to update wishlist.",
      ...options,
    });

  const clearWishlist = async (options?: ApiHandlerOptions) => {
    if (!wishlistProducts.length) return { success: true };
    for (const prod of wishlistProducts) {
      const pId = typeof prod === "string" ? prod : prod._id;
      await crudMutation({
        endpoint: endpoints.wishlistRoutes.base,
        method: "POST",
        data: { productId: pId },
      }).unwrap();
    }

    refetchWishlist();
    return handleApiCall(
      Promise.resolve({
        success: true,
        message: options?.successMessage || "Wishlist cleared successfully",
      }),
      options
    );
  };

  const getWishlist = (options?: ApiHandlerOptions) =>
    handleApiCall(
      triggerGetWishlist(endpoints.wishlistRoutes.base).unwrap(),
      { errorMessage: "Failed to fetch wishlist.",
        ...options,
      }
    );

  const isInWishlist = (productId: string): boolean =>
    wishlistProducts.some((p: any) => p._id === productId || p === productId);

  return {
    wishlistQuery: queryResult,
    wishlist: wishlistData,
    wishlistProducts,
    isLoadingWishlist: queryResult.isLoading,
    isWishlistMutationLoading,
    isWishlistLazyLoading,
    refetchWishlist,
    getWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
  };
};