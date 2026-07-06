export function FilterBar({
  categories,
  searchText,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onResetFilters,
  sortBy,
  onSortChange,

}) {
  return (
    <section className="filter-bar" aria-label="Filters">
      <label className="search-field">
        <span>Search places</span>
        <input
          type="search"
          value={searchText}
          placeholder="Try food, lake, museum..."
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <label className="sort-field">
        <span>Sort by</span>
        <select 
          value={sortBy} 
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="default">Default</option>
          <option value="cost">Lowest cost</option>
          <option value="duration">Shortest duration</option>
          <option value="highest-cost">Highest cost</option>
          <option value="longest-duration">Longest duration</option>
        </select>
      </label>

      <div className="category-group" aria-label="Category filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={category === selectedCategory ? 'active' : ''}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <button type="button" className="ghost-button" onClick={onResetFilters}>
        Reset
      </button>
    </section>
  )
}
