import { MovieCard } from './MovieCard'

export function MovieList({
  movies,
  shortlistIds,
  onToggleShortlist,
  onSelectMovie,
}) { 
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isShortlisted={shortlistIds.includes(movie.id)}
          onToggleShortlist={onToggleShortlist}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </div>
  )
}

