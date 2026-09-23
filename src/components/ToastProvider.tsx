import { Toaster as SonnerToaster } from "sonner";

export const ToastProvider = () => (
  <SonnerToaster
    position="bottom-right"
    toastOptions={{ duration: 1000, style: { zIndex: 999999 } }}
  />
);
