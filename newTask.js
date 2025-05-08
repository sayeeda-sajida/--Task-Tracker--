import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function NewTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8090/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        alert("Task added successfully");
        navigate("/", { state: { refresh: true } });
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>New Task</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="title">Title:</label></td>
              <td>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="description">Description:</label></td>
              <td>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  required
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                <button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Task"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}