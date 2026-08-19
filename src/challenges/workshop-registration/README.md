# Exercise 1: "Workshop Registration" (1-2h, untimed, cold attempt)

**Build a conference workshop registration flow.** Single page with a heading and a "Register" button that opens a **modal dialog** containing a **two-step form**.

**Step 1, "Your details":**

- Full name (text, required)
- Email (required, valid format)
- Country (select, required)
- Ticket type (radio group: Standard / Student / VIP, required)

**Step 2, "Preferences":**

- Workshops (checkbox group, at least one required, min. 4 options)
- Dietary requirements (textarea, optional)
- Accept code of conduct (single checkbox, required)

**Behaviour:**

- "Next" validates step 1 before advancing; "Back" returns without losing data
- Inline errors on blur, full validation on submit of each step
- Submit fires a fake API call (promise + ~1.5s delay) that randomly succeeds or fails; show a submitting state, a success state (close modal, confirmation on the page), and a recoverable error state
- Modal: focus moves in on open, stays trapped, returns to "Register" on close; Escape closes it (with data kept)
