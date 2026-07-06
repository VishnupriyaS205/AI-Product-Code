import { EmptyState } from './EmptyState'
import { MovieList } from './MovieList'
export function Shortlist({ movies, onRemoveMovie }) {
  return (
    <aside className="shortlist">
      <div className="section-heading">
        <h2>Shortlist</h2>
        <p>{movies.length} saved</p>
      </div>

     {movies.length > 0 ? (
        <div className="shortlist-grid">
          <MovieList
            movies={movies}
            shortlistIds={movies.map((movie) => movie.id)}
            onToggleShortlist={onRemoveMovie}
          />
        </div>
    ) : (
      <EmptyState message="Your shortlist is empty. Save movies you may watch tonight." />
    )}
    </aside>
  )
}
