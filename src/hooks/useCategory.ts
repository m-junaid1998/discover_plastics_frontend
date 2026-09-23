import { useGetQuery, useLazyGetQuery, useCrudMutation } from "../api/apiSlice";
import { endpoints } from "../api/config";
import { useApiHandler, type ApiHandlerOptions } from "../api/useApiHandler";
import type { PaginationParams } from "./Pagination/usePaginationParams";

export const useCategory = (params?: PaginationParams) => {
  const [crudMutation, { isLoading: isCategoryMutationLoading }] = useCrudMutation();
  const [triggerGetCategories, { isLoading: isCategoryLazyLoading }] = useLazyGetQuery();
  const { handleApiCall } = useApiHandler();

  const queryResult = useGetQuery(
    { endpoint: endpoints.categoryRoutes.getAll },
    {  refetchOnFocus: true} 
  );

  const { refetch } = queryResult;
  const exec = async (
    endpoint: string,
    method: "POST" | "PUT" | "DELETE",
    data?: any,
    options?: ApiHandlerOptions
  ) => {
    const res = await handleApiCall(crudMutation({ endpoint, method, data }).unwrap(), options);
    if (res?.success) refetch(); 
    return res;
  };

  return {
    categoriesQuery: queryResult, 
    categories: queryResult.data?.data || [],
    isLoadingCategories: queryResult.isLoading,
    refetchCategories: refetch,

    isCategoryMutationLoading,
    isCategoryLazyLoading,

    getCategories: (customParams?: PaginationParams, options?: ApiHandlerOptions) =>
      handleApiCall(
        triggerGetCategories({ endpoint: endpoints.categoryRoutes.getAll, params: customParams || params }).unwrap(),
        { errorMessage: "Failed to fetch categories.", ...options }
      ),

    createCategory: (data: any, options?: ApiHandlerOptions) =>
      exec(endpoints.categoryRoutes.create, "POST", data, {
        successMessage: "Category created successfully.",
        errorMessage: "Failed to create category.",
        ...options,
      }),

    updateCategory: (id: string | number, categoryname: string, options?: ApiHandlerOptions) =>
      exec(endpoints.categoryRoutes.update(id), "PUT", { categoryname }, {
        successMessage: "Category updated successfully.",
        errorMessage: "Failed to update category.",
        ...options,
      }),

    deleteCategory: (id: string | number, options?: ApiHandlerOptions) =>
      exec(endpoints.categoryRoutes.delete(id), "DELETE", undefined, {
        successMessage: "Category deleted successfully.",
        errorMessage: "Failed to delete category.",
        ...options,
      }),

    addSubCategory: (id: string | number, subCategoryName: string, options?: ApiHandlerOptions) =>
      exec(endpoints.categoryRoutes.addSubCategory(id), "PUT", { subCategoryName }, {
        successMessage: "Sub-category added successfully.",
        errorMessage: "Failed to add sub-category.",
        ...options,
      }),

    updateSubCategory: (id: string | number, payload: { oldSubCategoryName: string; newSubCategoryName: string }, options?: ApiHandlerOptions) =>
      exec(endpoints.categoryRoutes.updateSubCategory(id), "PUT", payload, {
        successMessage: "Sub-category updated successfully.",
        errorMessage: "Failed to update sub-category.",
        ...options,
      }),

    removeSubCategory: (id: string | number, subCategoryName: string, options?: ApiHandlerOptions) =>
      exec(endpoints.categoryRoutes.removeSubCategory(id), "PUT", { subCategoryName }, {
        successMessage: "Sub-category removed successfully.",
        errorMessage: "Failed to remove sub-category.",
        ...options,
      }),
  };
};