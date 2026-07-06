import { useState } from 'react'
function BookCard({ book, onToggleBook, onDeleteBook, onEditBook }) { 
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(book.title)
  const [editedAuthor, setEditedAuthor] = useState(book.author)
  const [editError, setEditError] = useState('')
 function handleSaveEdit() {
  if (editedTitle.trim() === '' || editedAuthor.trim() === '') {
    setEditError('Title and author are required')
    return
  }

 onEditBook(book.id, editedTitle.trim(), editedAuthor.trim())
  setEditError('')
  setIsEditing(false)
}
function handleCancelEdit() {
  setEditedTitle(book.title)
  setEditedAuthor(book.author)
  setEditError('')
  setIsEditing(false)
}
function handleStartEdit() {
  setEditError('')
  setIsEditing(true)
}
  return (
    <article className="book-card">
      <div className="cover-box" aria-hidden="true">
        {book.title.slice(0, 1)}
      </div>

      <div className="book-info">
         {isEditing ? (
        <>
        <label>
          Title
          <input
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            placeholder="Book title"
            required
          />
        </label>

        <label>
          Author
          <input
            value={editedAuthor}
            onChange={(event) => setEditedAuthor(event.target.value)}
            placeholder="Author name"
            required
          />
        </label>
        {editError && <p className="error-text">{editError}</p>}
      </>
    ) : (
    <>
      <h2 className={book.isCompleted ? 'completed-title' : ''}>
        {book.title}
      </h2>
      <p>{book.author}</p>
    </>
  )}
</div>
      <span className={book.isCompleted ? 'status completed' : 'status pending'}>
        {book.isCompleted ? 'Completed' : 'Pending'}
      </span>

      <div className="book-actions">
        <button
          type="button"
          onClick={() => onToggleBook(book.id)}
          disabled={isEditing}
        >
          {book.isCompleted ? 'Mark pending' : 'Mark done'}
        </button>
                {book.isCompleted && (
          <p className="locked-note">Mark pending to edit this book.</p>
        )}
        <button
          type="button"
          className="danger"
          onClick={() => onDeleteBook(book.id)}
          disabled={isEditing}
        >
          Delete
        </button>
       {isEditing ? (
  <>
    <button type="button" onClick={handleSaveEdit}>
      Save
    </button>
    <button type="button" onClick={handleCancelEdit}>
      Cancel
    </button>
  </>
) : (
  !book.isCompleted && (
    <button type="button" onClick={handleStartEdit}>
      Edit
    </button>
  )
)}
      </div>
    </article>
  )
}

export default BookCard
