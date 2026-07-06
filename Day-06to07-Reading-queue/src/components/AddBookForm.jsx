import { useState } from 'react'

function AddBookForm({ onAddBook }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !author.trim()) {
      return
    }

    onAddBook(title.trim(), author.trim())
    setTitle('')
    setAuthor('')
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <label>
        Book title
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: Ikigai"
        />
      </label>

      <label>
        Author
        <input
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Example: Hector Garcia"
        />
      </label>

      <button type="submit">Add book</button>
    </form>
  )
}

export default AddBookForm
