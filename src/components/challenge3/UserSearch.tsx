import { useState, type ChangeEvent } from "react";
import useDebouncedValue from "./useDebouncedValue";
import useFetch from "./useFetch";

type Profile = {
  id: string;
  name: string;
};

export default function UserSearch() {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebouncedValue(query);

  const url = debouncedQuery
    ? `https://jsonplaceholder.typicode.com/users?query=${debouncedQuery}`
    : "";

  const { data: profiles, isLoading, error } = useFetch<Profile[]>(url);

  const onSearchChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setQuery(evt.target.value);
  };

  return (
    <div>
      <label htmlFor="search">
        Search term:
        <input
          id="search"
          type="text"
          value={query}
          onChange={onSearchChange}
        />
      </label>

      <div>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {profiles && (
          <>
            <h2>Results</h2>
            <ul>
              {profiles?.map((p) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
