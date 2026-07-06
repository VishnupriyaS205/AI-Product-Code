import { useState } from 'react'
import './App.css'

const categories = ['Food', 'Travel', 'Stay', 'Shopping', 'Bills', 'Other']

const starterGroups = [
  { id: 1, name: 'Goa trip', members: 4 },
  { id: 2, name: 'Flatmates', members: 5 },
]

const starterExpenses = [
  { id: 1, title: 'Cafe dinner', amount: 1850, people: 4, category: 'Food', groupId: 1 },
  { id: 2, title: 'Cab to beach', amount: 720, people: 3, category: 'Travel', groupId: 1 },
  { id: 3, title: 'Apartment snacks', amount: 940, people: 5, category: 'Shopping', groupId: 2 },
]

const emptyForm = {
  title: '',
  amount: '',
  people: '',
  category: 'Food',
  groupId: '1',
}

const defaultSettings = {
  displayName: 'vishnu',
  defaultPeople: '4',
  currencyCode: 'INR',
}

function formatMoney(amount, currencyCode = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount)
}

function parsePositiveNumber(value) {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null
  }

  return parsedValue
}

function calculateTotal(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0)
}

function calculatePerPerson(amount, people) {
  return people > 0 ? amount / people : 0
}

function Sidebar({ activeView, onChangeView }) {
  const views = ['Dashboard', 'Groups', 'Analytics', 'Settings']

  return (
    <aside className="sidebar">
      <div className="brand-mark">S</div>
      <div>
        <p className="eyebrow">SplitSmart</p>
        <h1>Expense splitter</h1>
      </div>

      <nav className="nav-list" aria-label="Dashboard navigation">
        {views.map((view) => (
          <button
            key={view}
            type="button"
            className={activeView === view ? 'active' : ''}
            onClick={() => onChangeView(view)}
          >
            {view}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function SummaryCard({ label, value, detail }) {
  return (
    <article className="summary-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  )
}

function ExpenseForm({ form, groups, error, isEditing, onChange, onSubmit, onCancel }) {
  return (
    <form className="expense-form glass-panel" onSubmit={onSubmit}>
      <div className="section-heading">
        <p className="eyebrow">Quick entry</p>
        <h2>{isEditing ? 'Edit' : 'Add expense'}</h2>
      </div>

      <label>
        Expense name
        <input
          type="text"
          value={form.title}
          onChange={(event) => onChange('title', event.target.value)}
          placeholder="Dinner, cab, tickets"
        />
      </label>

      <div className="form-grid">
        <label>
          Amount
          <input
            type="number"
            min="1"
            step="1"
            value={form.amount}
            onChange={(event) => onChange('amount', event.target.value)}
            placeholder="2500"
          />
        </label>

        <label>
          People
          <input
            type="number"
            min="1"
            step="1"
            value={form.people}
            onChange={(event) => onChange('people', event.target.value)}
            placeholder="4"
          />
        </label>
      </div>

      <label>
        Category
        <select value={form.category} onChange={(event) => onChange('category', event.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Group
        <select value={form.groupId} onChange={(event) => onChange('groupId', event.target.value)}>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error-text">{error}</p>}

      <div className="form-actions">
        <button type="submit">{isEditing ? 'Save changes' : 'Add expense'}</button>
        {isEditing && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
         
        )}
      </div>
    </form>
  )
}

function ExpenseCard({ expense, groupName, currencyCode, onEdit, onDelete }) {
  const perPerson = calculatePerPerson(expense.amount, expense.people)

  return (
    <article className="expense-card">
      <div className="category-icon">{expense.category.slice(0, 1)}</div>
      <div>
        <h3>{expense.title}</h3>
        <p>{expense.category} - {groupName} - {expense.people} people</p>
      </div>
      <div className="expense-amount">
        <strong>{formatMoney(expense.amount, currencyCode)}</strong>
        <span>{formatMoney(perPerson, currencyCode)} each</span>
      </div>
      <div className="card-actions">
        <button type="button" onClick={() => onEdit(expense)}>Edit</button>
        <button type="button" className="danger" onClick={() => onDelete(expense.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}

function ExpenseList({ expenses, groups, currencyCode, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <section className="empty-state glass-panel">
        <h2>No expenses yet</h2>
        <p>Add your first expense to see totals and per-person split.</p>
      </section>
    )
  }

  return (
    <section className="expense-list">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          groupName={groups.find((group) => group.id === expense.groupId)?.name ?? 'No group'}
          currencyCode={currencyCode}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

function GroupsView({
  groups,
  expenses,
  selectedGroupExpenses,
  selectedGroupId,
  newGroup,
  onSelectGroup,
  onNewGroupChange,
  onAddGroup,
  onEdit,
  onDelete,
}) {
  const selectedGroup = groups.find((group) => group.id === selectedGroupId)
  const selectedGroupTotal = calculateTotal(selectedGroupExpenses)

  return (
    <section className="page-panel glass-panel">
      <div className="section-heading">
        <p className="eyebrow">Groups</p>
        <h2>Manage split groups</h2>
      </div>

      <form className="inline-form" onSubmit={onAddGroup}>
           <input
              type="text"
              value={newGroup}
              onChange={(event) => onNewGroupChange(event.target.value)}
              placeholder="New group name"
            />
          <button type="submit">Add group</button>
      </form>

      <div className="group-grid">
        {groups.map((group) => {
          const groupExpenses = expenses.filter((expense) => expense.groupId === group.id)
          const groupTotal = calculateTotal(groupExpenses)

          return (
            <button
              key={group.id}
              type="button"
              className={`group-card ${selectedGroupId === group.id ? 'selected' : ''}`}
              onClick={() => onSelectGroup(group.id)}
            >
              <strong>{group.name}</strong>
              <span>{group.members} members</span>
              <span>{groupExpenses.length} expenses</span>
              <b>{formatMoney(groupTotal)}</b>
            </button>
          )
        })}
      </div>
      <div className="expense-list">
        <h3>Selected expenses - {selectedGroup?.name}</h3>
        <p>Total: {formatMoney(selectedGroupTotal)}</p>

        {selectedGroupExpenses.length === 0 ? (
          <p>No expenses in this group yet.</p>
        ) : (
          selectedGroupExpenses.map((expense) => (
            <article className="expense-card" key={expense.id}>
              <div className="category-icon">{expense.category.slice(0, 1)}</div>
              <div>
                <h3>{expense.title}</h3>
                <p>{expense.category} - {expense.people} people</p>
              </div>
              
              <div className="card-actions">
                <button type="button" onClick={() => onEdit(expense)}>Edit</button>
                <button type="button" className="danger" onClick={() => onDelete(expense.id)}>
                  Delete
                </button>
              </div>
              <div className="expense-amount">
                <strong>{formatMoney(expense.amount)}</strong>
                <span>{formatMoney(calculatePerPerson(expense.amount, expense.people))} each</span>
              </div>
              
            </article>
          ))
        )}
      </div>
      
    </section>
  )
}

function AnalyticsView({ expenses, currencyCode }) {
  const totalExpense = calculateTotal(expenses)
  const categoryTotals = categories
    .map((category) => ({
      category,
      total: calculateTotal(expenses.filter((expense) => expense.category === category)),
    }))
    .filter((item) => item.total > 0)

  return (
    <section className="page-panel glass-panel">
      <div className="section-heading">
        <p className="eyebrow">Analytics</p>
        <h2>Spending by category</h2>
        <p>Total spending: {formatMoney(totalExpense, currencyCode)}</p>
      </div>

      {categoryTotals.length === 0 ? (
        <p className="muted-text">Add expenses to see analytics.</p>
      ) : (
        <div className="analytics-list">
          {categoryTotals.map((item) => {
            const width = totalExpense > 0 ? `${(item.total / totalExpense) * 100}%` : '0%'

            return (
              <div className="analytics-row" key={item.category}>
                <div>
                  <strong>{item.category}</strong>
                  <span>{formatMoney(item.total, currencyCode)}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function SettingsView({ settings, savedMessage, onChange, onSave }) {
  return (
    <form className="page-panel glass-panel settings-form" onSubmit={onSave}>
      <div className="section-heading">
        <p className="eyebrow">Settings</p>
        <h2>App preferences</h2>
      </div>

      <label>
        Display name
        <input
          type="text"
          value={settings.displayName}
          onChange={(event) => onChange('displayName', event.target.value)}
        />
      </label>

      <label>
        Default people
        <input
          type="number"
          min="1"
          step="1"
          value={settings.defaultPeople}
          onChange={(event) => onChange('defaultPeople', event.target.value)}
        />
      </label>

      <label>
        Currency
        <select value={settings.currencyCode} onChange={(event) => onChange('currencyCode', event.target.value)}>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </label>

      {savedMessage && <p className="success-text">{savedMessage}</p>}

      <button type="submit">Save settings</button>
    </form>
  )
}

function App() {
  const [expenses, setExpenses] = useState(starterExpenses)
  const [groups, setGroups] = useState(starterGroups)
  const [selectedGroupId, setSelectedGroupId] = useState(starterGroups[0].id)
  const selectedGroupExpenses = expenses.filter(
    (expense) => expense.groupId === selectedGroupId
  )
  const [activeView, setActiveView] = useState('Dashboard')
  const [settings, setSettings] = useState(defaultSettings)
  const [savedMessage, setSavedMessage] = useState('')
  const [newGroup, setNewGroup] = useState('')
  const [form, setForm] = useState({
    ...emptyForm,
    people: defaultSettings.defaultPeople,
    groupId: String(starterGroups[0].id),
  })
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  const totalExpense = calculateTotal(expenses)
  const totalPeople = expenses.reduce((total, expense) => total + expense.people, 0)
  const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0
  const groupShare = totalPeople > 0 ? totalExpense / totalPeople : 0
  const highestExpense = expenses.reduce((highest, expense) => {
    return expense.amount > highest ? expense.amount : highest
  }, 0)

  function resetForm() {
    setForm({ ...emptyForm, people: settings.defaultPeople, groupId: String(selectedGroupId) })
  }

  function handleFormChange(field, value) {
    setForm({ ...form, [field]: value })
    setError('')
  }

  function validateForm() {
    const amount = parsePositiveNumber(form.amount)
    const people = parsePositiveNumber(form.people)

    if (form.title.trim() === '') {
      return 'Please enter an expense name.'
    }

    if (amount === null) {
      return 'Amount must be a number greater than 0.'
    }

    if (people === null || !Number.isInteger(people)) {
      return 'People must be a whole number greater than 0.'
    }

    if (!groups.some((group) => group.id === Number(form.groupId))) {
      return 'Please choose a group.'
    }

    return ''
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationMessage = validateForm()

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    const expenseData = {
      title: form.title.trim(),
      amount: Number(form.amount),
      people: Number(form.people),
      category: form.category,
      groupId: Number(form.groupId),
    }

    if (editingId) {
      setExpenses(
        expenses.map((expense) => {
          if (expense.id === editingId) {
            return { ...expense, ...expenseData }
          }

          return expense
        }),
      )
    } else {
      setExpenses([{ id: Date.now(), ...expenseData }, ...expenses])
    }

    resetForm()
    setEditingId(null)
    setError('')
  }

  function handleEditExpense(expense) {
    setEditingId(expense.id)
    setForm({
      title: expense.title,
      amount: String(expense.amount),
      people: String(expense.people),
      category: expense.category,
      groupId: String(expense.groupId),
    })
    setError('')
    setActiveView('Dashboard')
  }

  function handleDeleteExpense(expenseId) {
    setExpenses(expenses.filter((expense) => expense.id !== expenseId))

    if (editingId === expenseId) {
      resetForm()
      setEditingId(null)
      setError('')
    }
  }

  function handleCancelEdit() {
    resetForm()
    setEditingId(null)
    setError('')
  }

  function handleAddGroup(event) {
    event.preventDefault()

    const trimmedName = newGroup.trim()

    if (trimmedName === '') {
      return
    }

    const group = {
      id: Date.now(),
      name: trimmedName,
      members: Number(settings.defaultPeople) || 1,
    }

    setGroups([...groups, group])
    setSelectedGroupId(group.id)
    setForm({ ...form, groupId: String(group.id) })
    setNewGroup('')
  }

  function handleSelectGroup(groupId) {
    setSelectedGroupId(groupId)
    setForm({ ...form, groupId: String(groupId) })
  }

  function handleSettingsChange(field, value) {
    setSettings({ ...settings, [field]: value })
    setSavedMessage('')
  }

  function handleSaveSettings(event) {
    event.preventDefault()

    if (parsePositiveNumber(settings.defaultPeople) === null) {
      setSavedMessage('Default people must be greater than 0.')
      return
    }

    setSavedMessage('Settings saved.')
  }

  return (
    <main className="app-shell">
      <Sidebar activeView={activeView} onChangeView={setActiveView} />

      <section className="dashboard">
        <header className="hero-panel glass-panel">
          <div>
            <p className="eyebrow">Weekend budget</p>
            <h2>Hi {settings.displayName || 'friend'}, split smarter.</h2>
            <p>
              Practice numeric input, parsing, validation, helper functions,
              derived totals, groups, analytics, and settings.
            </p>
          </div>
          <div className="hero-total">
            <span>Total spend</span>
            <strong>{formatMoney(totalExpense, settings.currencyCode)}</strong>
          </div>
        </header>

        {activeView === 'Dashboard' && (
          <>
            <section className="summary-grid" aria-label="Expense summary">
              <SummaryCard
                label="Total expenses"
                value={formatMoney(totalExpense, settings.currencyCode)}
                detail={`${expenses.length} entries`}
              />
              <SummaryCard
                label="Per-person average"
                value={formatMoney(groupShare, settings.currencyCode)}
                detail={`${totalPeople} total shares`}
              />
              <SummaryCard
                label="Average bill"
                value={formatMoney(averageExpense, settings.currencyCode)}
                detail="Based on saved expenses"
              />
              <SummaryCard
                label="Highest expense"
                value={formatMoney(highestExpense, settings.currencyCode)}
                detail="Largest saved amount"
              />
            </section>

            <section className="workspace">
              <ExpenseForm
                form={form}
                groups={groups}
                error={error}
                isEditing={editingId !== null}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
              />

              <section className="glass-panel list-panel">
                <div className="section-heading">
                  <p className="eyebrow">Live ledger</p>
                  <h2>Expenses</h2>
                </div>

                <ExpenseList
                  expenses={expenses}
                  groups={groups}
                  currencyCode={settings.currencyCode}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
              </section>
            </section>
          </>
        )}
      
        {activeView === 'Groups' && (
         <GroupsView
            groups={groups}
            expenses={expenses}
            selectedGroupExpenses={selectedGroupExpenses}
            selectedGroupId={selectedGroupId}
            newGroup={newGroup}
            onSelectGroup={handleSelectGroup}
            onNewGroupChange={setNewGroup}
            onAddGroup={handleAddGroup}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}  
          />
        )}

        {activeView === 'Analytics' && (
          <AnalyticsView expenses={expenses} currencyCode={settings.currencyCode} />
        )}

        {activeView === 'Settings' && (
          <SettingsView
            settings={settings}
            savedMessage={savedMessage}
            onChange={handleSettingsChange}
            onSave={handleSaveSettings}
          />
        )}
      </section>
    </main>
  )
}

export default App
