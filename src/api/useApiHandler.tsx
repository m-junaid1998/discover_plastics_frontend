import { toast } from "sonner";

export interface ApiHandlerOptions {
  successMessage?: string | ((data: any) => string);
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApiHandler = () => {
  const parseErr = (err: any, fallback?: string) =>
    fallback || err?.data?.message || err?.message || (err?.status === "FETCH_ERROR" ? "Network error." : "Something went wrong.");

  const handleApiCall = async <T = any>(apiPromise: Promise<any>, opts: ApiHandlerOptions = {}): Promise<{ success: boolean; data?: T; error?: any }> => {
    try {
      const res = await apiPromise;
      if (res?.success === false) throw res;
      const msg = opts.successMessage !== undefined ? opts.successMessage : res?.message;
      if (msg) toast.success(msg);
      opts.onSuccess?.(res);
      return { success: true, data: res };
    } catch (err: any) {
      const msg = parseErr(err, opts.errorMessage);
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
      opts.onError?.(err);
      return { success: false, error: msg, data: err?.success === false ? err : undefined };
    }
  };

  return { handleApiCall };
};