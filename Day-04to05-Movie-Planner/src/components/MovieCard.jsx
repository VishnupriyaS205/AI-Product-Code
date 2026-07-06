export function MovieCard({
  movie,
  isShortlisted,
  onToggleShortlist,
  onSelectMovie,
}) {
  const posterUrl = `https://picsum.photos/seed/movie-${movie.id}/360/480`

  return (
    <article
      className="movie-card"
      onClick={() => {
        if (onSelectMovie) {
          onSelectMovie(movie)
        }
      }}
    >
      <img className="movie-poster" src={posterUrl} alt={`${movie.title} poster`} />

      <div>
        <p className="pill">{movie.genre}</p>
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          {movie.rating} | {movie.runtime} min | {movie.mood}
        </p>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onToggleShortlist(movie.id)
        }}
      >
        {isShortlisted ? 'Remove' : 'Shortlist'}
      </button>
    </article>
  )
}
