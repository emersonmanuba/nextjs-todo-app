"use client";

interface Task {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  dateCreated: string;
  dateStarted: string | null;
  dateCompleted: string | null;
}

import { motion, Reorder } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"All Tasks" | "Pending" | "Active" | "Completed">("All Tasks");


  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Function to handle adding a new task
  const addTask = () => {
    if (task.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: task,
        status: "pending",
        dateCreated: new Date().toISOString(),
        dateStarted: null,
        dateCompleted: null,
      };
      setTasks([...tasks, newTask]);
      setTask("");
    }
  };

  // Function to marked the task as started
  const markedStarted = (id: string) => {
    const updatedTasks = tasks.map(task_start =>
      task_start.id === id ? {
        ...task_start, status: "in-progress" as const,
        dateStarted: new Date().toISOString()
      } : task_start); // Create a shallow copy
    setTasks(updatedTasks);
  }

  // Function to mark the task as completed
  const markedCompleted = (id: string) => {
    const updatedTasks = tasks.map(task_complete =>
      task_complete.id === id ? {
        ...task_complete, completed: true,
        status: "completed" as const,
        dateCompleted: new Date().toISOString()
      } : task_complete);
    setTasks(updatedTasks);
  }

  // Function to toggle task completion
  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find(toggle => toggle.id === id);
    if (!task) return;

    if (task.status === "pending") {
      markedStarted(id);
    } else if (task.status === "in-progress") {
      markedCompleted(id);
    } else {
      // If completed, revert to in-progress
      const updatedTasks = tasks.map(toggle =>
        toggle.id === id ? {
          ...toggle,
          status: "in-progress" as const,
          dateFinished: null
        } : toggle
      );
      setTasks(updatedTasks);
    }
  };


  // Function to remove a task
  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter(remove => remove.id !== id);
    setTasks(updatedTasks);
  }

  // Function to start editing a task
  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditText(currentTitle);
  };

  // Function to save edited task
  const saveEditedTask = (id: string) => {
    if (editText.trim()) {
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].title = editText;
        setTasks(updatedTasks);
      }
    }
    setEditText("");
    setEditingId(null);
  }

  // Function to cancel editing
  const cancelEditing = () => {
    setEditText("");
    setEditingId(null);
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not Set";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  //Function to filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === "All Tasks") return true;
    if (filter === "Pending") return task.status === "pending";
    if (filter === "Active") return task.status === "in-progress";
    if (filter === "Completed") return task.status === "completed";
    return true;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-4">My To-do App</h1>
      <div className="flex items-center justify-between w-2xl max-w-5xl mb-12 mt-12">
        {/* This is a simple to-do app built with React and Tailwind CSS. */}
        <input
          type="text"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addTask();
            }
          }}
          placeholder="Enter a new task"
          className="border p-2 mb-4 w-1/2"
        />
        <button
          onClick={() => {
            addTask();
            setTask("");
          }}
          className="bg-blue-500 text-white p-2 rounded mb-4"
        >
          Add Task
        </button>
      </div>
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("All Tasks")}
          className={`px-4 py-2 rounded transition-colors ${filter === "All Tasks"
            ? "bg-blue-600 text-white"
            : "bg-blue-300 text-gray-700 hover:bg-gray-300"
            }`}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setFilter("Pending")}
          className={`px-4 py-2 rounded transition-colors ${filter === "Pending"
              ? "bg-gray-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-300"
            }`}
        >
          Pending ({tasks.filter((pending) => pending.status === "pending").length})
        </button>
        <button
          onClick={() => setFilter("Active")}
          className={`px-4 py-2 rounded transition-colors ${filter === "Active"
            ? "bg-orange-400 text-white"
            : "bg-orange-300 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Active ({tasks.filter((active) => active.status === "in-progress").length})
        </button>
        <button
          onClick={() => setFilter("Completed")}
          className={`px-4 py-2 rounded transition-colors ${filter === "Completed"
            ? "bg-green-600 text-white"
            : "bg-green-300 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Completed ({tasks.filter((completed) => completed.status === "completed").length})
        </button>
      </div>
      {/* Task List with Drag-and-Drop Reordering */}
      <div className="space-y-4 p-2 w-full max-w-2xl">
        {filteredTasks.length === 0 ? (
          <div className="p-6 bg-gray-50 border rounded-lg text-gray-700">
            {filter === "All Tasks" ? "No tasks available. Please add a task." : `No ${filter.toLowerCase()} tasks available. Please add a task.`}
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={filteredTasks}
            onReorder={setTasks}
            className="space-y-2"
          >
            {filteredTasks.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="p-3 bg-blue-700 border rounded-lg flex justify-between items-center"
              >
                <div className="mr-3 text-white text-xl select-none">⋮⋮</div>
                {/* Conditional rendering: edit mode and view mode */}
                {editingId === item.id ? (
                  // Edit Mode
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditedTask(item.id);
                      if (e.key === "Escape") cancelEditing();
                    }}
                    className="border p-1 rounded w-2/3"
                    autoFocus
                  />
                ) : (
                  // View Mode
                  <div className="flex-1">
                    <motion.div
                      onClick={() => toggleTaskCompletion(item.id)}
                      //onDoubleClick={() => startEditing(item.id, item.title)}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <span className={`block ${item.status === "completed" ? "line-through text-gray-300" : "text-white"
                        }`}>
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${item.status === "pending" ? "bg-gray-500" :
                          item.status === "in-progress" ? "bg-orange-400 text-gray-100" :
                            "bg-green-500"
                          }`}>
                          {item.status === "pending" ? "Pending" :
                            item.status === "in-progress" ? "In Progress" :
                              "Completed"}
                        </span>
                      </div>
                    </motion.div>
                    <div className="text-sm text-gray-300 mt-1 space-y-0.5">
                      📅 Created: {formatDate(item.dateCreated)}
                      {item.dateStarted && <div>🚀 Started: {formatDate(item.dateStarted)}</div>}
                      {item.dateCompleted && <div>✅ Finished: {formatDate(item.dateCompleted)}</div>}
                    </div>
                  </div>
                )}

                <div className="space-x-4">
                  {editingId === item.id ? (
                    // Save and Cancel buttons in edit mode
                    <>
                      <motion.button
                        onClick={() => saveEditedTask(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-500 text-white p-1.5 rounded"
                      >
                        Save
                      </motion.button>
                      <motion.button
                        onClick={cancelEditing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-500 text-white p-1.5 rounded"
                      >
                        Cancel
                      </motion.button>
                    </>
                  ) : (
                    <>
                      {item.status === "pending" && (
                        <motion.button
                          onClick={() => markedStarted(item.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 text-white px-2 py-1.5 rounded text-sm"
                        >
                          Start
                        </motion.button>
                      )}
                      {item.status === "in-progress" && (
                        <motion.button
                          onClick={() => markedCompleted(item.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-500 text-white px-2 py-1.5 rounded text-sm"
                        >
                          Complete
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => startEditing(item.id, item.title)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-500 text-white p-1.5 rounded"
                      >
                        Edit Task
                      </motion.button>
                      {/* Action Buttons - Delete button functional */}
                      <motion.button
                        onClick={() => removeTask(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 text-white p-1.5 rounded"
                      >
                        Delete Task
                      </motion.button>
                    </>
                  )}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </main>
  );
};