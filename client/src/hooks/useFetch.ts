import { useState, useEffect, useCallback } from "react";

interface FetchState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true });
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      };
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      setState({ data: json.data, error: null, isLoading: false });
    } catch (err: any) {
      setState({ data: null, error: err.message, isLoading: false });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
