import { useCrudMutation } from "../api/apiSlice";
import { endpoints } from "../api/config";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../store/authSlice";
import { useApiHandler, type ApiHandlerOptions } from "../api/useApiHandler";
import type { RootState } from "../store/store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state: RootState) => state.auth?.refreshToken);
  const [crudMutation, { isLoading: isAuthLoading }] = useCrudMutation();
  const { handleApiCall } = useApiHandler();

  const executeAuthRequest = (
    endpoint: string,
    method: "POST" | "PUT" | "DELETE",
    data?: any,
    options?: ApiHandlerOptions
  ) => {
    return handleApiCall(
      crudMutation({ endpoint, method, data }).unwrap(),
      options
    );
  };

  const handleAuthSuccess = (res: any, options?: ApiHandlerOptions) => {
    dispatch(loginSuccess(res));
    options?.onSuccess?.(res);
  };

  const getWelcome = (res: any) => {
    const name = [res?.firstname, res?.lastname].filter(Boolean).join(" ");
    return name ? `Welcome ${name}` : "Welcome To Discover Plastics";
  };

  const loginUser = (loginPayload: any, options?: ApiHandlerOptions) =>
    executeAuthRequest(endpoints.authRoutes.login, "POST", loginPayload, {
      errorMessage: "Login failed.",
      successMessage: options?.successMessage || getWelcome,
      ...options,
      onSuccess: (res) => handleAuthSuccess(res, options),
    });

  const googleLoginUser = (idToken: string, options?: ApiHandlerOptions) =>
    executeAuthRequest(endpoints.authRoutes.google, "POST", { idToken }, {
      errorMessage: "Google Login failed.",
      successMessage: options?.successMessage || getWelcome,
      ...options,
      onSuccess: (res) => handleAuthSuccess(res, options),
    });

  const registerUser = (registerPayload: any, options?: ApiHandlerOptions) =>
    executeAuthRequest(endpoints.authRoutes.register, "POST", registerPayload, {
      errorMessage: "Registration failed.",
      successMessage: options?.successMessage || getWelcome,
      ...options,
      onSuccess: (res) => handleAuthSuccess(res, options),
    });

  const updatePassword = (passwordPayload: any, options?: ApiHandlerOptions) =>
    executeAuthRequest(endpoints.authRoutes.updatepassword, "PUT", passwordPayload, {
      successMessage: "Password updated successfully.",
      errorMessage: "Password update failed.",
      ...options,
    });

  const deleteUser = (email: string, options?: ApiHandlerOptions) =>
    executeAuthRequest(endpoints.authRoutes.deleteUser, "DELETE", { email }, {
      successMessage: "User deleted successfully.",
      errorMessage: "Account deletion failed.",
      ...options,
      onSuccess: (res) => {dispatch(logout());options?.onSuccess?.(res)},
    });

  const logoutUser = (options?: ApiHandlerOptions) =>
    executeAuthRequest(endpoints.authRoutes.logout, "POST", { refreshToken }, {
      successMessage: options?.successMessage || "Logged out successfully.",
      ...options,
      onSuccess: (res) => { dispatch(logout()); options?.onSuccess?.(res); },
      onError: (err) => { dispatch(logout()); options?.onError?.(err); },
    });

  return {
    isAuthLoading,
    loginUser,
    googleLoginUser,
    registerUser,
    updatePassword,
    deleteUser,
    logoutUser,
  };
};