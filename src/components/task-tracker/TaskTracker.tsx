import { useState, type ChangeEvent } from "react";

type Task = {
  id: number;
  description: string;
  status: "active" | "completed";
};

type TaskFilter = "all" | Task["status"];

export default function TaskTracker() {
  /**
   * Requirements:
   * Input contains task description, Add Task adds a task with that description.
   * Task list items have "Complete" and "Delete" buttons.
   * Complete marks the item as done (e.g. striketrhough) without removal.
   * Delete removes the task from the list.
   * Filter control above list (All, Active, Completed).
   * - List should update to show only matching tasks.
   * - If no tasks match filter, show message "No tasks to show."
   * Empty/blank tasks are not allowed.
   */

  const [newTaskText, setNewTaskText] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const filteredTasks = tasks.filter(
    (t) => filter === "all" || t.status === filter,
  );

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(evt.target.value);
  };

  const onAddClick = () => {
    const newDescription = newTaskText.trim();

    // No empty tasks allowed.
    if (!newDescription) return;

    const newTask: Task = {
      id: Math.random(),
      description: newDescription,
      status: "active",
    };

    setTasks((old) => [...old, newTask]);
    setNewTaskText(""); // clear input for convenience
  };

  const toggleTaskStatus = (taskId: number) => {
    setTasks((old) =>
      old.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "completed" ? "active" : "completed" }
          : t,
      ),
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks((old) => old.filter((t) => t.id !== taskId));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="My new task."
        value={newTaskText}
        onChange={onInputChange}
      />
      <button onClick={onAddClick}>Add Task</button>
      <div id="taskList">
        <div>
          <label htmlFor="filters">Filters:</label>
          <div id="filters">
            <button
              style={{ fontWeight: filter === "all" ? "bold" : "normal" }}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              style={{ fontWeight: filter === "active" ? "bold" : "normal" }}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              style={{ fontWeight: filter === "completed" ? "bold" : "normal" }}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        <h2>My Tasks</h2>
        <ol>
          {filteredTasks.length === 0 && <p>No tasks to show.</p>}
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <span
                style={{
                  textDecoration:
                    task.status === "completed" ? "line-through" : "none",
                }}
              >
                {task.description}
              </span>
              <button onClick={() => toggleTaskStatus(task.id)}>
                Complete
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
