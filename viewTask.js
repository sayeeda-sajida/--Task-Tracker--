import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './styleview.css'

export default function ViewTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // Fetch task details from backend
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8090/tasks/${id}`);
        const data = await response.json();
        setTask(data);
        setEditedTitle(data.title);
        setEditedDescription(data.description);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8090/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          completed: task.completed // Ensure completed status is sent
        }),
      });
  
      if (response.ok) {
        alert("Task updated successfully");
        navigate("/", { state: { refresh: true } });
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  if (!task) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Task Details</h2>
      <form onSubmit={handleUpdate}>
        <table className="details-table">
          <tbody>
            <tr>
              <td><label htmlFor="title">Title:</label></td>
              <td>
                <input
                  id="title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Title"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="description">Description:</label></td>
              <td>
                <textarea
                  id="description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Description"
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center", paddingTop: "10px" }}>
                <button className="toggle" type="submit">Update Task</button>
               
                <button 
                  type="button"
                  onClick={() => navigate("/")}
                  style={{ marginLeft: "10px" }}
                >
                  Back
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}  