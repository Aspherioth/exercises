# Challenge 1 — Search-as-you-type with race conditions

**Prompt:** Build a UserSearch component with a text input. As the user types, fetch results from a (mock) API and display them in a list. Assume the mock API has variable latency (some requests resolve faster than others).

**The trap:** if you fire a fetch on every keystroke without guarding against out-of-order responses, a slow request for an earlier query can resolve after a fast request for a later query, overwriting the correct results with stale ones. This is the single most common thing that gets missed.

**Edge cases to self-check against once you've built it:**

- Type "a", then quickly "ab", then "abc". Does the list ever briefly show results for "a" after showing "abc"?
- What happens if the input is cleared entirely mid-request, does the fetch still complete and render something?
- Does rapid typing spawn a new fetch per keystroke with no debounce, hammering the API? (Debounce is a separate concern from race-proofing, both should exist.)
- Unmounting the component while a request is in-flight, does it throw a "can't update state on unmounted component" warning?
