import { useState } from 'react'
import './App.css'
import AddBookForm from './components/AddBookForm.jsx'
import BookList from './components/BookList.jsx'
import { starterBooks } from './data/books.js'

function createBook(title, author) {
  return {
    id: Date.now(),
    title,
    author,
    isCompleted: false,
  }
}

function App() {
  const [books, setBooks] = useState(starterBooks)
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [activeView, setActiveView] = useState('queue')
  const completedCount = books.filter((book) => book.isCompleted).length
  const pendingCount = books.filter((book) => !book.isCompleted).length
  const allBooksCompleted = books.length > 0 && pendingCount === 0
  const progressPercent =
    books.length === 0 ? 0 : Math.round((completedCount / books.length) * 100)
  const filteredBooks = books.filter((book) => {
    const bookText = `${book.title} ${book.author}`.toLowerCase()
    const matchesSearch = bookText.includes(searchText.toLowerCase())
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'completed' && book.isCompleted) ||
      (activeFilter === 'pending' && !book.isCompleted)

    return matchesSearch && matchesFilter
  })
  const sortedBooks = [...filteredBooks].sort((a, b) => {
  if (sortOrder === 'newest') {
    return b.id - a.id
  }

  return a.id - b.id
})

  function handleAddBook(title, author) {
    const newBook = createBook(title, author)
    setBooks([newBook, ...books])
  }

  function handleToggleBook(bookId) {
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          isCompleted: !book.isCompleted,
        }
      }

      return book
    })

    setBooks(updatedBooks)
  }

  function handleDeleteBook(bookId) {
    const remainingBooks = books.filter((book) => book.id !== bookId)
    setBooks(remainingBooks)
  }
  function handleEditBook(bookId, newTitle, newAuthor) {
  const updatedBooks = books.map((book) => {
    if (book.id === bookId) {
      return {
        ...book,
        title: newTitle,
        author: newAuthor,
      }
    }

    return book
  })

  setBooks(updatedBooks)
}

function handleClearCompleted() {
  const pendingBooks = books.filter((book) => !book.isCompleted)
  setBooks(pendingBooks)
}
  

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <header className="app-header">
          <p className="eyebrow">My queue</p>
          <h1>Reading Queue</h1>
        </header>

        <section className="stats-row" aria-label="Reading queue counts">
          <div>
            <span>{books.length}</span>
            <p>Total</p>
          </div>
          <div>
            <span>{completedCount}</span>
            <p>Completed</p>
          </div>
          <div>
            <span>{pendingCount}</span>
            <p>Pending</p>
          </div>
        </section>

        {activeView === 'queue' && (
          <>
            {allBooksCompleted && (
              <p className="success-message">All books are completed!</p>
            )}
            <button
              type="button"
              className="clear-button"
              onClick={handleClearCompleted}
              disabled={completedCount === 0}
            >
              Clear completed ({completedCount})
            </button>
            <AddBookForm onAddBook={handleAddBook} />

            <section className="queue-controls">
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by title or author"
                aria-label="Search books"
              />
              <p className="control-label">Sort by</p>
              <div className="filter-tabs" aria-label="Sort order">
                <button
                  type="button"
                  className={sortOrder === 'newest' ? 'active' : ''}
                  onClick={() => setSortOrder('newest')}
                >
                  Newest
                </button>
                <button
                  type="button"
                  className={sortOrder === 'oldest' ? 'active' : ''}
                  onClick={() => setSortOrder('oldest')}
                >
                  Oldest
                </button>
              </div>
              <div className="filter-tabs" aria-label="Book filters">
                <button
                  type="button"
                  className={activeFilter === 'all' ? 'active' : ''}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={activeFilter === 'completed' ? 'active' : ''}
                  onClick={() => setActiveFilter('completed')}
                >
                  Completed
                </button>
                <button
                  type="button"
                  className={activeFilter === 'pending' ? 'active' : ''}
                  onClick={() => setActiveFilter('pending')}
                >
                  Pending
                </button>
              </div>
            </section>

            <BookList
              books={sortedBooks}
              activeFilter={activeFilter}
              searchText={searchText}
              onToggleBook={handleToggleBook}
              onDeleteBook={handleDeleteBook}
              onEditBook={handleEditBook}
            />
          </>
        )}

        {activeView === 'stats' && (
          <section className="detail-panel" aria-label="Reading stats">
            <h2>Reading stats</h2>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p>{progressPercent}% of your queue is completed.</p>
            <p>You have {pendingCount} book(s) still waiting.</p>
          </section>
        )}

        {activeView === 'profile' && (
          <section className="detail-panel" aria-label="Reader profile">
            <h2>Reader profile</h2>
            <p>Current goal: finish this reading queue.</p>
            <p>Best next step: mark one pending book as done after reading it.</p>
          </section>
        )}

        <nav className="bottom-nav" aria-label="App navigation preview">
          <button
            type="button"
            className={activeView === 'queue' ? 'active' : ''}
            onClick={() => setActiveView('queue')}
          >
            Queue
          </button>
          <button
            type="button"
            className={activeView === 'stats' ? 'active' : ''}
            onClick={() => setActiveView('stats')}
          >
            Stats
          </button>
          <button
            type="button"
            className={activeView === 'profile' ? 'active' : ''}
            onClick={() => setActiveView('profile')}
          >
            Profile
          </button>
        </nav>
      </section>
    </main>
  )
}

export default App
