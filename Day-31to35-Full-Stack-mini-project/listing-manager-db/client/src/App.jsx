import { useCallback, useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:3000/students";
const AUTH_URL = "http://localhost:3000/auth";

const emptyForm = {
  student_name: "",
  classroom: "",
  location: "",
  status: "",
  description: "",
};

async function requestJson(url, options = {}) {
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

function ProtectedRoute({ currentUser, isCheckingAuth, children }) {
  if (isCheckingAuth) {
    return <p className="empty-state">Checking login...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AuthPage({
  authForm,
  authMode,
  error,
  isAuthLoading,
  message,
  onAuthChange,
  onAuthSubmit,
  onSwitchMode,
}) {
  return (
    <section className="auth-shell">
      <form className="panel auth-form" onSubmit={onAuthSubmit}>
        <h2>{authMode === "login" ? "Login" : "Create Account"}</h2>

        {authMode === "signup" && (
          <label>
            Name
            <input
              name="name"
              value={authForm.name}
              onChange={onAuthChange}
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            name="email"
            type="email"
            value={authForm.email}
            onChange={onAuthChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            minLength="6"
            value={authForm.password}
            onChange={onAuthChange}
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={isAuthLoading}>
            {isAuthLoading ? "Please wait..." : authMode === "login" ? "Login" : "Signup"}
          </button>
          <button type="button" className="secondary" onClick={onSwitchMode}>
            {authMode === "login" ? "Need account?" : "Have account?"}
          </button>
        </div>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}

function DashboardPage({
  deletingId,
  error,
  form,
  isEditing,
  isLoading,
  isSaving,
  message,
  onCancelEdit,
  onChange,
  onDelete,
  onStartEdit,
  onSubmit,
  students,
}) {
  return (
    <section className="layout">
      <form className="panel student-form" onSubmit={onSubmit}>
        <h2>{isEditing ? "Edit Record" : "Add Record"}</h2>

        <label>
          Student name
          <input
            name="student_name"
            value={form.student_name}
            onChange={onChange}
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
            onChange={onChange}
            required
          />
        </label>

        <label>
          Location
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Status
          <input name="status" value={form.status} onChange={onChange} required />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows="3"
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>

          {isEditing && (
            <button type="button" className="secondary" onClick={onCancelEdit}>
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
                        <button type="button" onClick={() => onStartEdit(student)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          disabled={deletingId === student.id}
                          onClick={() => onDelete(student)}
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
  );
}

function App() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(token));
  const [deletingId, setDeletingId] = useState(null);

  const isEditing = editingId !== null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchStudents = useCallback(async (authToken = token) => {
    if (!authToken) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await requestJson(API_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let ignore = false;

    async function checkSavedLogin() {
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      setIsCheckingAuth(true);

      try {
        const data = await requestJson(`${AUTH_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (ignore) return;

        setCurrentUser(data.currentUser);
        fetchStudents(token);
      } catch {
        if (ignore) return;

        localStorage.removeItem("authToken");
        setToken("");
        setCurrentUser(null);
        setStudents([]);
      } finally {
        if (!ignore) {
          setIsCheckingAuth(false);
        }
      }
    }

    checkSavedLogin();

    return () => {
      ignore = true;
    };
  }, [token, fetchStudents]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleAuthChange(event) {
    const { name, value } = event.target;
    setAuthForm({ ...authForm, [name]: value });
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsAuthLoading(true);

    try {
      if (authMode === "signup") {
        await requestJson(`${AUTH_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(authForm),
        });

        setMessage("Signup done. Now login with the same email and password.");
        setAuthMode("login");
        setAuthForm({ ...authForm, password: "" });
        return;
      }

      const data = await requestJson(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
        }),
      });

      localStorage.setItem("authToken", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      setAuthForm({ name: "", email: "", password: "" });
      setMessage("");
      fetchStudents(data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    setToken("");
    setCurrentUser(null);
    setStudents([]);
    resetForm();
    setMessage("");
    setError("");
    navigate("/login", { replace: true });
  }

  function switchAuthMode() {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setMessage("");
    setError("");
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
          ...authHeaders,
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
      await requestJson(`${API_URL}/${student.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
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
          <p>
            {currentUser
              ? `Logged in as ${currentUser.name || currentUser.email}`
              : "Login to manage PostgreSQL records."}
          </p>
        </div>

        {currentUser ? (
          <nav className="nav-actions" aria-label="Main navigation">
            <NavLink className="nav-link" to="/dashboard">
              Dashboard
            </NavLink>
            <span className="record-count">{students.length} records</span>
            <button type="button" className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        ) : (
          <nav className="nav-actions" aria-label="Main navigation">
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
            <span className="record-count">Protected</span>
          </nav>
        )}
      </header>

      <Routes>
        <Route
          path="/"
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage
                authForm={authForm}
                authMode={authMode}
                error={error}
                isAuthLoading={isAuthLoading}
                message={message}
                onAuthChange={handleAuthChange}
                onAuthSubmit={handleAuthSubmit}
                onSwitchMode={switchAuthMode}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute currentUser={currentUser} isCheckingAuth={isCheckingAuth}>
              <DashboardPage
                deletingId={deletingId}
                error={error}
                form={form}
                isEditing={isEditing}
                isLoading={isLoading}
                isSaving={isSaving}
                message={message}
                onCancelEdit={cancelEdit}
                onChange={handleChange}
                onDelete={handleDelete}
                onStartEdit={startEdit}
                onSubmit={handleSubmit}
                students={students}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </main>
  );
}

export default App;
