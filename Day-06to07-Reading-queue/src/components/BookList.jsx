import BookCard from './BookCard.jsx'

function BookList({
  books,
  activeFilter,
  searchText,
  onToggleBook,
  onDeleteBook,
  onEditBook,
}) {
  if (books.length === 0) {
    let emptyTitle = 'No books found'
let emptyMessage = 'Add a book or change your search and filter.'

if (searchText) {
  emptyMessage = `No results for "${searchText}".`
} else if (activeFilter === 'completed') {
  emptyTitle = 'No completed books yet'
  emptyMessage = 'Mark a book as done to see it here.'
} else if (activeFilter === 'pending') {
  emptyTitle = 'No pending books'
  emptyMessage = 'All books are completed.'
}
    return (
      <section className="empty-state">
       <h2>{emptyTitle}</h2>
      <p>{emptyMessage}</p>
      
      </section>
    )
  }

  return (
    <section className="book-list" aria-label="Books in reading queue">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onToggleBook={onToggleBook}
          onDeleteBook={onDeleteBook}
          onEditBook={onEditBook}
        />
      ))
      }
    </section>
  )
}

export default BookList
