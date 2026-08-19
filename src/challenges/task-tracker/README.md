# React Task Tracker

Build a simple task tracker component. Starting point: assume you're given a basic component shell with an input, an "Add Task" button, and an empty container with id `taskList`.

**Requirements:**

- Users can type a task description into the input and click "Add Task" to add it to the list
- Each task in the list should display its text and have a "Complete" button and a "Delete" button
- Clicking "Complete" should visually mark the task as done (e.g. strikethrough) without removing it from the list
- Clicking "Delete" should remove the task from the list entirely
- Add a simple filter control above the list with three options: All, Active, Completed — the list should update to show only the matching tasks
- If there are no tasks matching the current filter, show the message: "No tasks to show."
- Don't allow adding an empty/blank task (trim whitespace before checking)
