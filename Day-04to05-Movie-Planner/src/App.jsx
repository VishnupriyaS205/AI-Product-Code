import { useState } from 'react'
import './App.css'
import { movies } from './data/movies'
import { EmptyState } from './components/EmptyState'
import { FilterBar } from './components/FilterBar'
import { MovieList } from './components/MovieList'
import { Shortlist } from './components/Shortlist'

function App() {
  const [searchText, setSearchText] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [shortlistIds, setShortlistIds] = useState([])
  const [activePage, setActivePage] = useState('movies')
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState([])
  const [selectedMood, setSelectedMood] = useState('All')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const moods = ['All', ...new Set(movies.map((movie) => movie.mood))]
  const genres = ['All', ...new Set(movies.map((movie) => movie.genre))]

  const visibleMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchText.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre
    const matchesMood = selectedMood === 'All' || movie.mood === selectedMood
    return matchesSearch && matchesGenre && matchesMood
  })

  const shortlistedMovies = movies.filter((movie) =>
    shortlistIds.includes(movie.id),
  )

  const movieGroups = genres
    .filter((genre) => genre !== 'All')
    .map((genre) => ({
      genre,
      movies: visibleMovies
        .filter((movie) => movie.genre === genre)
        .slice(0, 7),
    }))
    .filter((group) => group.movies.length > 0)

  function handleToggleShortlist(movieId) {
    if (shortlistIds.includes(movieId)) {
      setShortlistIds(shortlistIds.filter((id) => id !== movieId))
    } else {
      setShortlistIds([...shortlistIds, movieId])
    }
  }

  function handleClearFilters() {
    setSearchText('')
    setSelectedGenre('All')
    setSelectedMood('All')
  }

  function handleAddReview(event) {
    event.preventDefault()

    if (reviewName.trim() === '' || reviewText.trim() === '') {
      return
    }

    const newReview = {
      id: Date.now(),
      name: reviewName,
      text: reviewText,
    }

    setReviews([newReview, ...reviews])
    setReviewName('')
    setReviewText('')
  }

  function handleScrollTheme(event, direction) {
    const themeRow = event.currentTarget.closest('.theme-row')
    const movieList = themeRow.querySelector('.movie-list')

    movieList.scrollBy({
      left: direction === 'left' ? -260 : 260,
      behavior: 'smooth',
    })
  }


  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Day 4 project</p>
          <h1>Movie Night Planner</h1>
          <p className="subtitle">
            Search the mock movie list, filter by genre, and save a shortlist.
          </p>
        </div>
        <div className="count-box">
          <span>{shortlistIds.length}</span>
          saved
        </div>
      </header>

      <nav className="app-nav" aria-label="Movie planner pages">
        <button
          type="button"
          className={activePage === 'movies' ? 'nav-button active' : 'nav-button'}
          onClick={() => setActivePage('movies')}
        >
          Movies
        </button>
        <button
          type="button"
          className={
            activePage === 'shortlist' ? 'nav-button active' : 'nav-button'
          }
          onClick={() => setActivePage('shortlist')}
        >
          Shortlist
        </button>
        <button
          type="button"
          className={activePage === 'reviews' ? 'nav-button active' : 'nav-button'}
          onClick={() => setActivePage('reviews')}
        >
          Reviews
        </button>
      </nav>

      {activePage === 'movies' && (
        <section className="page-frame movies-page">
          <div className="section-heading">
            <h2>Movies</h2>
            <p>{visibleMovies.length} movie(s)</p>
          </div>

          <div className="search-frame movies-search">
           <FilterBar
            searchText={searchText}
            selectedGenre={selectedGenre}
            selectedMood={selectedMood}
            genres={genres}
            moods={moods}
            onSearchChange={setSearchText}
            onGenreChange={setSelectedGenre}
            onMoodChange={setSelectedMood}
            onClearFilters={handleClearFilters}
          />
          </div>
          {selectedMovie && (
  <section className="selected-preview">
    <div className="selected-poster"></div>
    <div>
      <p className="preview-label">Selected for preview</p>
      <h3>{selectedMovie.title}</h3>
      <p>{selectedMovie.genre}</p>
      <p>
        {selectedMovie.rating} | {selectedMovie.runtime} min | {selectedMovie.mood}
      </p>
      <button type="button" onClick={() => setSelectedMovie(null)}>
        Close
      </button>
    </div>
  </section>
)}

          {visibleMovies.length > 0 ? (
            <div className="movie-theme-board">
              {movieGroups.map((group) => (
                <section className="theme-row" key={group.genre}>
                  <div className="theme-heading">
                    <h3>{group.genre}</h3>
                    <div className="theme-actions">
                      <p>{group.movies.length} movie(s)</p>
                      <button
                        type="button"
                        className="scroll-button"
                        onClick={(event) => handleScrollTheme(event, 'left')}
                      >
                        &lt;
                      </button>
                      <button
                        type="button"
                        className="scroll-button"
                        onClick={(event) => handleScrollTheme(event, 'right')}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>

                  <MovieList
                    movies={group.movies}
                    shortlistIds={shortlistIds}
                    onToggleShortlist={handleToggleShortlist}
                    onSelectMovie={setSelectedMovie}
                  />
                </section>
              ))}
            </div>
          ) : (
            <EmptyState message="No movies match your search. Try another title or genre." />
          )}
        </section>
      )}

      {activePage === 'shortlist' && (
        <section className="page-frame shortlist-page">
          <Shortlist
            movies={shortlistedMovies}
            onRemoveMovie={handleToggleShortlist}
          />
        </section>
      )}

      {activePage === 'reviews' && (
        <section className="page-frame review-page">
          <div className="section-heading">
            <h2>Reviews</h2>
            <p>{reviews.length} review(s)</p>
          </div>

          <form className="review-form" onSubmit={handleAddReview}>
            <label>
              Your name
              <input
                type="text"
                value={reviewName}
                placeholder="Example: Anu"
                onChange={(event) => setReviewName(event.target.value)}
              />
            </label>

            <label>
              Your review
              <textarea
                value={reviewText}
                placeholder="Which movie should we watch tonight?"
                onChange={(event) => setReviewText(event.target.value)}
              />
            </label>

            <button type="submit">Add review</button>
          </form>

          {reviews.length > 0 ? (
            <div className="review-list">
              {reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <h3>{review.name}</h3>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message="No reviews yet. Add the first movie night review." />
          )}
        </section>
      )}
    </main>
  )
}

export default App
