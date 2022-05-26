import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useAuth = () => {
  const { status } = useSession();

  return useMemo(() => status === "authenticated", [status]);
};
