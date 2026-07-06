import { useState } from 'react'
import './App.css'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  workshop: 'React Foundations',
  ticketType: 'Regular',
  note: '',
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [submittedTicket, setSubmittedTicket] = useState(null)
  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
    setSuccessMessage('')
  }

  function validateForm() {
    const nextErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Name is required.'
    }

    if (!form.email.includes('@')) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    }

    return nextErrors
  }
  
  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateForm()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage('')
      return
    }

    setSubmittedTicket(form)
    setSuccessMessage('Signup complete. Your attendee pass is ready.')
    setForm(initialForm) 
  }
  

  return (
    <main className="app-shell">
      <section className="intro-section">
        <div>
          <p className="eyebrow">Workshop Registration</p>
          <h1>Signup Form and Live Attendee Pass</h1>
          <p className="intro-text">
            Fill the form and watch the attendee pass update instantly.
          </p>
        </div>
      </section>

      <section className="workspace-grid simple-grid">
        <form className="panel rsvp-form" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Signup</p>
              <h2>Attendee Details</h2>
            </div>
          </div>

          <label>
            Full Name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <small className="error-text">{errors.fullName}</small>
            )}
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </label>
          <label>
            Phone Number
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            {errors.phone && <small className="error-text">{errors.phone}</small>}
          </label>

          <label>
            Workshop
            <select name="workshop" value={form.workshop} onChange={handleChange}>
              <option value="React Foundations">React Foundations</option>
              <option value="JavaScript Debugging">JavaScript Debugging</option>
              <option value="Design Systems Lab">Design Systems Lab</option>
              <option value="Portfolio Review Clinic">
                Portfolio Review Clinic
              </option>
            </select>
          </label>

          <label>
            Ticket Type
            <select
              name="ticketType"
              value={form.ticketType}
              onChange={handleChange}
            >
              <option value="Regular">Regular</option>
              <option value="Student">Student</option>
              <option value="VIP">VIP</option>
            </select>
          </label>

          <label>
            Note
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Any request or note"
              rows="4"
            />
          </label>

          <button className="primary-button" type="submit">
            Submit Signup
          </button>

          {successMessage && <p className="success-text">{successMessage}</p>}
          
{submittedTicket && (
  <div className="submitted-ticket">
    <h3>Confirmed Ticket</h3>
    <p>{submittedTicket.fullName}</p>
    <p>{submittedTicket.workshop}</p>
    <p>{submittedTicket.ticketType} Entry</p>
  </div>
)}
        </form>

        <section className="ticket-preview" aria-label="Live attendee pass">
          <p className="ticket-label">Live Preview</p>
          <div className="ticket-card">
            <div>
              <span>{form.ticketType}</span>
              <h2>{form.workshop}</h2>
              <p>workshop entry Pass</p>
            </div>

            <dl>
              <div>
                <dt>Name</dt>
                <dd>{form.fullName || 'Your name'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{form.email || 'name@example.com'}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{form.phone || 'Your phone number'}</dd>
              </div>
              <div>
                <dt>Access</dt>
                <dd>{form.ticketType} Entry</dd>
              </div>
            </dl>

            <p className="ticket-note">{form.note || 'No note added.'}</p>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
