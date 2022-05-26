import { useRouter } from "next/router";
import { useEffect } from "react";
import { routes } from "../lib/utils";
import { useAuth } from "./useAuth";

export const useRedirectToHome = () => {
  const isAuthenticated = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${routes.home}`);
    }
  }, [isAuthenticated, router]);

  return null;
};
