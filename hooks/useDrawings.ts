import useSWR from "swr";
import { useAuth } from "./useAuth";

const fetcher = (path: string) => fetch(`/api/${path}`).then((r) => r.json());

export const useDrawings = () => {
  const isAuthenticated = useAuth();
  const { data } = useSWR(`drawings?auth=${isAuthenticated}`, fetcher);

  return data?.drawings;
};
