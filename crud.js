import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const task = express();
const port = 8090;
console.log ("cors")


task.use(cors());
task.use(express.json()); 

// MySQL database connection
let db;

const connectDB = async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root123',
      database: 'vaid',
    });
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Error connecting to database: ' + err.message);
  }
};

await connectDB();

// Get all tasks
task.get('/tasks', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM tasks');
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add a new task
task.post('/tasks', async (req, res) => {
  console.log(req.body); // Log the request body
  const { title, description } = req.body;
  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';

  try {
    const [result] = await db.query(query, [title, description]);
    res.status(201).send({ message: 'Task added successfully', id: result.insertId });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).send(err.message);
  }
});


// Get a single task by ID
task.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update task details (title, description, completed status)
task.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    await db.query(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
      [title, description, completed, id]
    );
    res.send({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE endpoint
task.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const deleteQuery = "DELETE FROM tasks WHERE id = ?";
  db.query(deleteQuery, [id], (error, results) => {
    if (error) {
      console.error("Error deleting task:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.status(200).json({ message: "Task deleted successfully" });
    }
  });
});



//  Start the server
task.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
