import { useState } from "react";
import { useApiHandler, type ApiHandlerOptions } from "../api/useApiHandler";
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID;

export const useNewsletter = () => {
  const [isNewsletterLoading, setIsLoading] = useState(false);
  const { handleApiCall } = useApiHandler();

  const subscribeNewsletter = async (email: string, opts?: ApiHandlerOptions) => {
    setIsLoading(true);
    try {
      return await handleApiCall(
        fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email }),
        }).then((res) => {
          if (!res.ok) throw new Error();
          return { success: true };
        }),
        {
          successMessage: "Thank you for subscribing!",
          errorMessage: "Failed to subscribe. Please try again.",
          ...opts,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { subscribeNewsletter, isNewsletterLoading };
};