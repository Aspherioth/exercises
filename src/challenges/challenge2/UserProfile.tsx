import useFetch from "./useFetch";

type Profile = {
  email: string;
  name: string;
  username: string;
};

export default function UserProfile() {
  const {
    data: profiles,
    loading,
    error,
    retry,
  } = useFetch<Profile[]>("https://jsonplaceholder.typicode.com/users");

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && (
        <>
          <p>{error}</p>
          <button onClick={retry}>Retry</button>
        </>
      )}
      {profiles && profiles.length > 0 && (
        <>
          <h3>
            Name: <span>{profiles[0].name}</span>
          </h3>
          <div>
            Email: <span>{profiles[0].email}</span>
          </div>
        </>
      )}
    </div>
  );
}
