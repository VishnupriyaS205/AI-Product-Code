CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  classroom INTEGER NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT
);
