"use client";

interface Task {
  id: string; // Unique identifier for the task
  title: string;
  status: "pending" | "in-progress" | "completed";
  date_created: string; // Changed to snake_case dateCreated
  date_started: string | null; // Changed to snake_case dateStarted
  date_completed: string | null; // Changed to snake_case dateCompleted
  order: number; // New field for task order
  user_id: string; // ID of the user who owns the task
}

import { motion, Reorder } from "framer-motion";
import { useState, useEffect } from "react";
import { PlusSquare, Trash, Check, Edit, X, Play } from "react-feather";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"All Tasks" | "Pending" | "Active" | "Completed">("All Tasks");
  const [loading, setLoading] = useState(true);


  // Load tasks from Supabase on component mount
  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);


  // Function to fetch all tasks from Supabase
  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  // Function to handle adding a new task
  const addTask = async () => {
    if (task.trim() && user) {
      const newTask = {
        title: task,
        status: "pending" as const,
        date_created: new Date().toISOString(),
        date_started: null,
        date_completed: null,
        order: tasks.length, // Set order based on current length
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks([...tasks, data]);
        setTask("");
      }
    }
  };

  // Function to marked the task as started
  const markedStarted = async (id: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: "in-progress" as const,
        date_started: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
    } else {
      setTasks(tasks.map(task => task.id === id ? data : task));
    }
  };


  // Function to mark the task as completed
  const markedCompleted = async (id: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: "completed",
        date_completed: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
    } else {
      setTasks(tasks.map(task => task.id === id ? data : task));
    }
  };

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
  const removeTask = async (id: string) => {
    //Show confirmation dialog
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error removing task:", error);
    } else {
      setTasks(tasks.filter(remove => remove.id !== id));
    }
  }

  // Function to start editing a task
  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditText(currentTitle);
  };

  // Function to save edited task
  const saveEditedTask = async (id: string) => {
    if (editText.trim()) {
      const { data, error } = await supabase
        .from('tasks')
        .update({ title: editText })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error saving edited task:", error);
      } else {
        setTasks(tasks.map(task => task.id === id ? data : task));
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

  const handleReorder = async (newOrder: Task[]) => {
    setTasks(newOrder);

    // Update order in Supabase
    const updates = newOrder.map((task, index) => ({
      id: task.id,
      order: index,
    }));

    for (const update of updates) {
      await supabase
        .from('tasks')
        .update({ order: update.order })
        .eq('id', update.id);
    }
  };

  // Function to format date strings
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

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Header with User Info and Log Out */}
      <div className="flex w-full max-w-5xl items-center justify-between mb-12">
        <h1 className="text-4xl font-bold mb-4">📝 My Todo App</h1>
        <div className="flex items-center gap-4">
          <span className="text-white">Welcome, {user.email}</span>
          <button
            onClick={signOut}
            className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
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
          className="border p-2 mb-4 w-1/2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <motion.button
          onClick={() => {
            addTask();
            setTask("");
          }}
          whileHover={{ scale: 1.05 }}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded mb-4 gap-2 flex items-center"
        >
          <PlusSquare size={25} />Add
        </motion.button>
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
        {loading ? (
          <div className="p-6 bg-gray-50 border rounded-lg text-gray-700">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-6 bg-gray-50 border rounded-lg text-gray-700">
            {filter === "All Tasks" ? "No tasks available. Please add a task." : `No ${filter.toLowerCase()} tasks available. Please add a task.`}
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={filteredTasks}
            onReorder={handleReorder}
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
                className="p-3 bg-blue-700 border rounded-lg flex justify-between items-center cursor-grab active:cursor-grabbing"
                style={{ touchAction: "none" }}
              >

                {/* Drag handle indicator */}
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
                      📅 Created: {formatDate(item.date_created)}
                      {item.date_started && <div>🚀 Started: {formatDate(item.date_started)}</div>}
                      {item.date_completed && <div>✅ Finished: {formatDate(item.date_completed)}</div>}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
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
                        {/* Save Button */}
                        <Check size={20} />
                      </motion.button>
                      <motion.button
                        onClick={cancelEditing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 text-white p-1.5 rounded"
                      >
                        {/* Cancel Button */}
                        <X size={20} />
                      </motion.button>
                    </>
                  ) : (
                    // Status and action buttons in view mode
                    <>
                      {item.status === "pending" && (
                        <motion.button
                          onClick={() => markedStarted(item.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 text-white px-2 py-1.5 rounded"
                        >
                          {/* Start Button */}
                          <Play size={20} />
                        </motion.button>
                      )}
                      {item.status === "in-progress" && (
                        <motion.button
                          onClick={() => markedCompleted(item.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-500 text-white px-2 py-1.5 rounded"
                        >
                          <Check size={20} />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => startEditing(item.id, item.title)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-500 text-white p-1.5 rounded"
                      >
                        <Edit size={20} />
                      </motion.button>
                      {/* Action Buttons - Delete button functional */}
                      <motion.button
                        onClick={() => removeTask(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 text-white p-1.5 rounded"
                      >
                        <Trash size={20} />
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