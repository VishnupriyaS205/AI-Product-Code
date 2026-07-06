export function FilterBar({
  searchText,
  selectedGenre,
  selectedMood,
  genres,
  moods,
  onSearchChange,
  onGenreChange,
  onMoodChange,
  onClearFilters,
}) {
  return (
    <section className="filter-bar">
      <label>
        Search
        <input
          type="search"
          value={searchText}
          placeholder="Try comedy or orbit"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <div className="genre-filter">
        <p>Filter by genre</p>
        <div className="genre-options">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              className={
                selectedGenre === genre ? 'genre-button active' : 'genre-button'
              }
              onClick={() => onGenreChange(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      <div className="genre-filter">
        <p>Filter by mood</p>
        <div className="genre-options">
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              className={
                selectedMood === mood ? 'genre-button active' : 'genre-button'
              }
              onClick={() => onMoodChange(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="clear-button" onClick={onClearFilters}>
        Clear filters
      </button>
    </section>
  )
}
