require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
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

const tokenSecret = process.env.TOKEN_SECRET || "dev_secret_change_me";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(password, savedPasswordHash) {
  const [salt, savedHash] = savedPasswordHash.split(":");
  const hash = crypto.scryptSync(password, salt, 64);
  const savedHashBuffer = Buffer.from(savedHash, "hex");

  return crypto.timingSafeEqual(hash, savedHashBuffer);
}

function createToken(user) {
  const payload = Buffer.from(
    JSON.stringify({ id: user.id, name: user.name, email: user.email }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", tokenSecret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

function verifyToken(token) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", tokenSecret)
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

function requireCurrentUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  const currentUser = token ? verifyToken(token) : null;

  if (!currentUser) {
    return res.status(401).json({ error: "Login required" });
  }

  req.user = currentUser;
  next();
}

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

app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "name, email, and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "password must be at least 6 characters",
    });
  }

  try {
    const passwordHash = hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash],
    );

    res.status(201).json({
      message: "Signup successful",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "email and password are required",
    });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/auth/me", requireCurrentUser, (req, res) => {
  res.json({ currentUser: req.user });
});

app.get("/students", requireCurrentUser, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM student WHERE user_id = $1 ORDER BY id",
      [req.user.id],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/students/:id", requireCurrentUser, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM student WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/students", requireCurrentUser, async (req, res) => {
  const { student_name, classroom, location, status, description } = req.body;
  const validationError = validateStudent(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      `INSERT INTO student (student_name, classroom, location, status, user_id, description)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
      [
        student_name,
        classroom,
        location,
        status,
        req.user.id,
        description || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database insert failed" });
  }
});

app.put("/students/:id", requireCurrentUser, async (req, res) => {
  const { student_name, classroom, location, status, description } = req.body;

  try {
    const recordResult = await pool.query(
      "SELECT * FROM student WHERE id = $1",
      [req.params.id],
    );

    const record = recordResult.rows[0];

    if (!record) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (record.user_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot edit this student" });
    }

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
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Database update failed" });
  }
});

app.delete("/students/:id", requireCurrentUser, async (req, res) => {
  try {
    const recordResult = await pool.query(
      "SELECT * FROM student WHERE id = $1",
      [req.params.id],
    );

    const record = recordResult.rows[0];

    if (!record) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (record.user_id !== req.user.id) {
      return res.status(403).json({
        error: "You cannot delete this student",
      });
    }

    const result = await pool.query(
      "DELETE FROM student WHERE id = $1 RETURNING *",
      [req.params.id],
    );

    res.json({
      message: "Student deleted",
      student: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Database delete failed" });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
