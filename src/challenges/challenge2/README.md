# Challenge 2 — Data fetch with loading/error/retry

**Prompt:** Build a UserProfile component that fetches a user by ID (passed as a prop) on mount, shows a loading spinner, shows the data on success, and shows an error message with a "Retry" button on failure.

**The trap:** people usually get the happy path right and the ID-change path wrong.

**Edge cases to self-check:**

- If the id prop changes while a previous fetch for the old ID is still in flight, does the component correctly discard that stale response instead of rendering the wrong user?
- Does clicking "Retry" actually reset the error state before refetching, or does it get stuck showing both the error and a spinner?
- If the component unmounts while loading, does anything try to touch state afterward?
- Fast prop changes (ID goes 1 → 2 → 3 rapidly): does only user 3's data ever get displayed, or does it flicker?
