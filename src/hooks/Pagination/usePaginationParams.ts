import { useState, useCallback } from "react";

export interface PaginationParams {
  currentPage?: number; pageSize?: number; sortOn?: string;
  sortDirection?: "asc" | "desc"; searchString?: string;
  isAllRecord?: boolean; fromDate?: string; toDate?: string;
  isNewArrival?:boolean; isPublished?:boolean | string;
  status?: string; dateRange?: string;  
}

const defaultParams: PaginationParams = {
  currentPage: 1, pageSize: 10, sortOn: "createdAt",
  sortDirection: "desc", searchString: "", isAllRecord: false
};

export const usePaginationParams = (initial: PaginationParams = {}) => {
  const [params, setParams] = useState<PaginationParams>({ ...defaultParams, ...initial });

  const updateParams = useCallback((newParams: Partial<PaginationParams>) => 
    setParams((prev) => ({ ...prev, ...newParams })), []);

  const handleSearch = useCallback((searchString: string) => 
    updateParams({ searchString, currentPage: 1 }), [updateParams]);

  const setPage = useCallback((currentPage: number) => 
    updateParams({ currentPage }), [updateParams]);

  const resetParams = useCallback(() => 
    setParams({ ...defaultParams, ...initial }), [initial]);

  return { params, setParams, updateParams, handleSearch, setPage, resetParams };
};