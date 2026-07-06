require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

function validateStudent(body) {
  const { student_name, classroom, location, status } = body;

  if (!student_name || !classroom || !location || !status) {
    return "student_name, classroom, location, and status are required";
  }

  return null;
}

app.get("/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM student ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/students/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM student WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/students", async (req, res) => {
  const { student_name, classroom, location, status, description } = req.body;
  const validationError = validateStudent(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      `INSERT INTO student (student_name, classroom, location, status, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [student_name, classroom, location, status, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database insert failed" });
  }
});

app.put("/students/:id", async (req, res) => {
  const { student_name, classroom, location, status, description } = req.body;
  const validationError = validateStudent(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      `UPDATE student
       SET student_name = $1,
           classroom = $2,
           location = $3,
           status = $4,
           description = $5
       WHERE id = $6
       RETURNING *`,
      [
        student_name,
        classroom,
        location,
        status,
        description || null,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database update failed" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM student WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted", student: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Database delete failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
