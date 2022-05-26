import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export const useProtectedRoute = () => {
  const { data, status } = useSession();

  useEffect(() => {
    if (!data?.user && status === "unauthenticated") {
      signIn();
    }
  }, [status, data]);

  return null;
};
