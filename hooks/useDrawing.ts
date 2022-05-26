import useSWR from "swr";

const fetcher = (path: string) => fetch(`/api/${path}`).then((r) => r.json());

export const useDrawing = (id: string) => {
  const { data } = useSWR(id ? `drawings/${id}` : null, fetcher);

  return data?.drawing;
};
