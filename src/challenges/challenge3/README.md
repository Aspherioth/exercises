# Challenge 3 — Debounced fetch with cancellation (the hardest one)

**Prompt:** Same as **Challenge 1**, but explicitly require the use of AbortController to cancel in-flight requests when a new one starts, and add a debounce of ~300ms before firing the fetch at all.

- **Challenge 1 Recap:** Build a UserSearch component with a text input. As the user types, fetch results from a (mock) API and display them in a list. Assume the mock API has variable latency (some requests resolve faster than others).

**The trap:** combining debounce and cancellation is where stale closures usually bite. People often capture a variable (like the search term or an abort controller ref) inside a useEffect or setTimeout callback, and by the time that callback runs, the captured value is outdated.

**Edge cases to self-check:**

- Does every keystroke properly cancel the previous timer, not just the previous fetch?
- If a request gets aborted, does your code correctly distinguish "aborted on purpose" from "a real network error" (an aborted fetch throws too, and naive code will show an error message for a cancellation, which is a very common bug)?
- Cleanup on unmount: does the useEffect cleanup function actually cancel both the pending timer and the pending request?
