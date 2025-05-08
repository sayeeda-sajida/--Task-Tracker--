import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import './styles.css';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8090/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Refresh tasks when flag or location state changes
  useEffect(() => {
    fetchTasks();
    if (location.state?.refresh) {
      navigate(location.pathname, { state: null }); // Clear state to prevent loop
    }
  }, [location.state, navigate]);
  

  // Handle delete action with confirmation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`http://localhost:8090/tasks/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Task deleted successfully");
          setRefreshFlag((prev) => !prev); // Trigger re-fetch
        } else {
          alert("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleStatusToggle = async (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  
    try {
      const response = await fetch(`http://localhost:8090/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !tasks.find(task => task.id === id).completed }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        console.log("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  

  const handleAddTask = () => {
    navigate("/newTask");
  };

  return (
    <div className="container">
      <h1>To Do List</h1>
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Task Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
              <button className="toggle" onClick={() => handleStatusToggle(task.id)}>
  {task.completed ? "✔️ Completed" : "❌ Pending"}
</button>

              </td>
              <td style={{width:"200px"}}>
                <button className="view" onClick={() => navigate(`/viewTask/${task.id}`)}>View</button>
                <button className="delete" onClick={() => handleDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add" onClick={handleAddTask}>Add New Task</button>
    </div>
  );
}
