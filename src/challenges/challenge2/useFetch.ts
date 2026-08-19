import { useEffect, useState } from "react";

const EMPTY_OPTIONS = {};

export default function useFetch<T>(
  url: string,
  options: RequestInit = EMPTY_OPTIONS,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    const abortCtlr = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(url, {
          ...options,
          signal: abortCtlr.signal,
        });

        if (!response.ok) {
          throw new Error("Response status: " + response.status);
        }

        const jsonData = await response.json();

        setError(null);
        setData(jsonData);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;

        setError(e instanceof Error ? e.message : "Failed to get profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortCtlr.abort();
      setData(null);
      setError(null);
      setLoading(false);
    };
  }, [url, options, attempts]);

  return {
    data,
    loading,
    error,
    retry: () => {
      setAttempts((prev) => prev + 1);
    },
  };
}
