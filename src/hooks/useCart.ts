import { useGetQuery, useLazyGetQuery, useCrudMutation } from "../api/apiSlice";
import { endpoints } from "../api/config";
import { useApiHandler, type ApiHandlerOptions } from "../api/useApiHandler";

export const useCart = (autoFetch = true) => {
  const [crudMutation, { isLoading: isCartMutationLoading }] = useCrudMutation();
  const [triggerGetCart, { isLoading: isCartLazyLoading }] = useLazyGetQuery();
  const { handleApiCall } = useApiHandler();

  const queryResult = useGetQuery(endpoints.cartRoutes.base, {
    skip: !autoFetch,
    refetchOnFocus: true,
  });
  const { refetch: refetchCart } = queryResult;

  const cartItems = queryResult.data?.data?.cartItems || [];

  const mutateCart = async (
    endpoint: string,
    method: "POST" | "DELETE",
    data?: any,
    options?: ApiHandlerOptions,
  ) => {
    const res = await handleApiCall(crudMutation({ endpoint, method, data }).unwrap(), options);
    if (res?.success) refetchCart();
    return res;
  };

  const addToCart = (product: string, qty = 1, isDirectUpdate = false, options?: ApiHandlerOptions , color?: string | null) =>
    mutateCart( endpoints.cartRoutes.base, "POST",
      { product, qty, isDirectUpdate , color },
      { errorMessage: "Failed to update cart.", ...options }
    );

  const removeFromCart = (productId: string, productName?: string, options?: ApiHandlerOptions) => {
   const customMsg = productName 
    ? `"${productName}" has been removed from your cart.` 
    : "Product has been removed from your cart.";

    return mutateCart(endpoints.cartRoutes.removeProduct(productId),
      "DELETE",undefined,
      { errorMessage: "Failed to remove item.",
        ...(customMsg !== undefined && { successMessage: customMsg }),
        ...options,
      }
    );
  };

  const clearCart = (options?: ApiHandlerOptions) =>
    mutateCart(endpoints.cartRoutes.base, "DELETE", undefined, {
      errorMessage: "Failed to clear cart.",
      ...options,
    });

  const getCart = (options?: ApiHandlerOptions) =>
    handleApiCall(triggerGetCart(endpoints.cartRoutes.base).unwrap(), {
      errorMessage: "Failed to fetch cart.",
      ...options,
    });

  const isInCart = (pId: string) => cartItems.some((i: any) => (i.product?._id || i.product) === pId);
  const getItemQty = (pId: string) => cartItems.find((i: any) => (i.product?._id || i.product) === pId)?.qty || 0;
  const totalItemsCount = cartItems.reduce((acc: number, i: any) => acc + (i.qty || 0), 0);
  const cartTotalAmount = cartItems.reduce((acc: number, i: any) => acc + (i.product?.salePrice || 0) * (i.qty || 0), 0);

  return {
    cartQuery: queryResult,
    cart: queryResult.data?.data,
    cartItems,
    totalItemsCount,
    cartTotalAmount,
    isLoadingCart: queryResult.isLoading,
    isCartMutationLoading,
    isCartLazyLoading,
    refetchCart,
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQty,
  };
};