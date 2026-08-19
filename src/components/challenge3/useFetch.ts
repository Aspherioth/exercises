import { useEffect, useState } from "react";

const EMPTY_OPTIONS = {};

export default function useFetch<T>(
  url: string,
  options: RequestInit = EMPTY_OPTIONS,
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState<number>(0);

  useEffect(() => {
    const abortCtrl = new AbortController();

    const fetchData = async () => {
      if (url === "") {
        setData(null);
        setError(null);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(url, {
          ...options,
          signal: abortCtrl.signal,
        });

        if (!response.ok) {
          throw new Error("Request Status: " + response.status);
        }

        const jsonData: T = await response.json();

        setError(null);
        setData(jsonData);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(
          e instanceof Error ? e.message : "An unexpected error ocurred!",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortCtrl.abort();
      setData(null);
      setError(null);
      setIsLoading(false);
    };
  }, [url, options, retryAttempts]);

  return {
    data,
    isLoading,
    error,
    retry: () => setRetryAttempts((old: number) => old + 1),
  };
}
