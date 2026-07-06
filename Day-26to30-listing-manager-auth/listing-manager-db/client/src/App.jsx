import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/students";

const emptyForm = {
  student_name: "",
  classroom: "",
  location: "",
  status: "",
  description: "",
};

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function validateForm(form) {
  if (!form.student_name.trim()) return "Student name is required";
  if (!form.classroom) return "Classroom is required";
  if (!form.location.trim()) return "Location is required";
  if (!form.status.trim()) return "Status is required";
  return "";
}

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isEditing = editingId !== null;

  async function fetchStudents() {
    setIsLoading(true);
    setError("");

    try {
      const data = await requestJson(API_URL);
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      const data = await requestJson(isEditing ? `${API_URL}/${editingId}` : API_URL, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          classroom: Number(form.classroom),
        }),
      });

      setMessage(isEditing ? `Updated ${data.student_name}` : `Saved ${data.student_name}`);
      resetForm();
      fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(student) {
    setEditingId(student.id);
    setMessage("");
    setError("");
    setForm({
      student_name: student.student_name,
      classroom: String(student.classroom),
      location: student.location,
      status: student.status,
      description: student.description || "",
    });
  }

  function cancelEdit() {
    resetForm();
    setMessage("");
    setError("");
  }

  async function handleDelete(student) {
    const shouldDelete = window.confirm(
      `Delete ${student.student_name}? This cannot be undone.`
    );

    if (!shouldDelete) return;

    setMessage("");
    setError("");
    setDeletingId(student.id);

    try {
      await requestJson(`${API_URL}/${student.id}`, { method: "DELETE" });
      setMessage(`Deleted ${student.student_name}`);
      fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <h1>Student Admin</h1>
          <p>Manage PostgreSQL records from one CRUD screen.</p>
        </div>
        <span className="record-count">{students.length} records</span>
      </header>

      <section className="layout">
        <form className="panel student-form" onSubmit={handleSubmit}>
          <h2>{isEditing ? "Edit Record" : "Add Record"}</h2>

          <label>
            Student name
            <input
              name="student_name"
              value={form.student_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Classroom
            <input
              name="classroom"
              type="number"
              min="1"
              value={form.classroom}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Status
            <input name="status" value={form.status} onChange={handleChange} required />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>

            {isEditing && (
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </form>

        <section className="panel table-panel">
          <h2>Records</h2>

          {isLoading && <p className="empty-state">Loading records...</p>}

          {!isLoading && students.length === 0 && (
            <p className="empty-state">No records yet. Add the first student.</p>
          )}

          {!isLoading && students.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.student_name}</td>
                      <td>{student.classroom}</td>
                      <td>{student.location}</td>
                      <td>{student.status}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" onClick={() => startEdit(student)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="danger"
                            disabled={deletingId === student.id}
                            onClick={() => handleDelete(student)}
                          >
                            {deletingId === student.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
