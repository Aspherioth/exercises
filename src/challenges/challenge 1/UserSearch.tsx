/**
 * Challenge 1 — Search-as-you-type with race conditions
 *
 * Prompt: Build a UserSearch component with a text input. As the user types,
 * fetch results from a (mock) API and display them in a list. Assume the mock
 * API has variable latency (some requests resolve faster than others).
 *
 * Test API: https://jsonplaceholder.typicode.com/users
 * (Optional) Delay endpoint: https://httpbin.org/delay/{seconds}
 */
import { useEffect, useState, type ChangeEvent } from "react";

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{ id: number; name: string }[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const updateSearchQuery = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt?.target?.value;
    setSearchQuery(value);
  };

  useEffect(() => {
    const abortController = new AbortController();

    const debounceTimer = setTimeout(() => {
      (async () => {
        // Avoid empty searches.
        if (searchQuery === "") {
          setError(null);
          setResults(null);

          return;
        }

        setSearching(true);

        try {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/users",
            { signal: abortController.signal },
          );

          if (!response.ok) {
            setSearching(false);
            setError("Failed to get users!");
            return;
          }

          const data = await response.json();
          setSearching(false);
          setError(null);
          setResults(data);
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") return;
          setError(e instanceof Error ? e.message : "Something went wrong");
        }
      })();
    }, 300);

    return () => {
      // Abort request and cancel search state.
      clearTimeout(debounceTimer);
      abortController.abort("cancelled");
      setSearching(false);
      setError(null);
    };
  }, [searchQuery]);

  return (
    <div>
      <input type="text" onChange={updateSearchQuery} value={searchQuery} />
      <div>
        <p>Results:</p>
        {searching && <p>Searching...</p>}
        {error && <p>An issue has occurred: {error}</p>}
        {!searching && results && (
          <div>
            <h1>Results</h1>
            <ul>
              {results.map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
