import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'recipe-box-state'

const starterRecipes = [
  {
    id: crypto.randomUUID(),
    title: 'Tomato Rice',
    category: 'Lunch',
    notes: 'Quick one-pot meal with rice, tomato, and spices.',
    isFavorite: true,
    difficulty: 'Easy',
    mealType: 'Veg',
  },
  {
    id: crypto.randomUUID(),
    title: 'Kulfi',
    category: 'Dessert',
    notes: 'Condensed milk with mixed nuts.',
    isFavorite: true,
    difficulty: 'Medium',
    mealType: 'Veg',
  },
  {
    id: crypto.randomUUID(),
    title: 'Banana Smoothie',
    category: 'Breakfast',
    notes: 'Blend banana, milk, and a little honey.',
    isFavorite: false,
    difficulty: 'Hard',
    mealType: 'Veg',
  },
]

const emptyForm = {
  title: '',
  category: 'Breakfast',
  notes: '',
  difficulty: 'Easy',
  mealType: 'Veg',
}

function loadSavedState() {
  const savedState = localStorage.getItem(STORAGE_KEY)

  if (!savedState) {
    return {
      recipes: starterRecipes,
      filter: 'All',
      showFavoritesOnly: false,
    }
  }

  return JSON.parse(savedState)
}

function App() {
  const [recipeBox, setRecipeBox] = useState(loadSavedState)
  const [formData, setFormData] = useState(emptyForm)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipeBox))
  }, [recipeBox])
  const [error, setError] = useState("");
  const recipeCategories = recipeBox.recipes.map((recipe) => recipe.category)
  const categories = ['All', ...new Set(recipeCategories)]
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedMealType, setSelectedMealType] = useState('All')

  const visibleRecipes = recipeBox.recipes.filter((recipe) => {
    const matchesCategory =
      recipeBox.filter === 'All' || recipe.category === recipeBox.filter
    const matchesFavorite = !recipeBox.showFavoritesOnly || recipe.isFavorite
    const matchesDifficulty =
      selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty
    const matchesMealType =
      selectedMealType === 'All' || recipe.mealType === selectedMealType

    return (
      matchesCategory && matchesFavorite && matchesDifficulty && matchesMealType
    )
  })
   const favoriteCount = recipeBox.recipes.filter((recipe) => recipe.isFavorite).length
   function handleClearFilters() {
  setRecipeBox((currentBox) => ({
    ...currentBox,
    filter: 'All',
    showFavoritesOnly: false,
  }))

  setSelectedDifficulty('All')
  setSelectedMealType('All')
}
  function handleFormChange(event) {
    const { name, value } = event.target

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function handleAddRecipe(event) {
    event.preventDefault()

    if (!formData.title.trim() || !formData.notes.trim()) {
      setError('Please fill recipe name and notes.')
      return
    }

    const newRecipe = {
      id: crypto.randomUUID(),
      title: formData.title.trim(),
      category: formData.category,
      notes: formData.notes.trim(),
      isFavorite: false,
      difficulty: formData.difficulty,
      mealType: formData.mealType,
    }

    setRecipeBox((currentBox) => ({
      ...currentBox,
      recipes: [newRecipe, ...currentBox.recipes],
    }))
    setFormData(emptyForm)
    setError('')
  }

  function handleFilterChange(category) {
    setRecipeBox((currentBox) => ({
      ...currentBox,
      filter: category,
    }))
  }

  function handleFavoriteToggle(recipeId) {
    setRecipeBox((currentBox) => ({
      ...currentBox,
      recipes: currentBox.recipes.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe,
      ),
    }))
  }

  function handleDeleteRecipe(recipeId) {
    setRecipeBox((currentBox) => ({
      ...currentBox,
      recipes: currentBox.recipes.filter((recipe) => recipe.id !== recipeId),
    }))
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setRecipeBox({
      recipes: starterRecipes,
      filter: 'All',
      showFavoritesOnly: false,
    })
    setFormData(emptyForm)
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Week 2 Day 9-10</p>
          <h1>Recipe Box</h1>
        </div>
        <button className="reset-button" type="button" onClick={handleReset}>
          Reset
        </button>
      </header>

      <section className="layout">
        <RecipeForm
          formData={formData}
          error={error}
          onFormChange={handleFormChange}
          onAddRecipe={handleAddRecipe}
        />

        <section className="recipe-panel">
          <RecipeFilters
            categories={categories}
            activeFilter={recipeBox.filter}
            selectedDifficulty={selectedDifficulty}
            selectedMealType={selectedMealType}
            showFavoritesOnly={recipeBox.showFavoritesOnly}
            onFilterChange={handleFilterChange}
            onDifficultyChange={setSelectedDifficulty}
            onMealTypeChange={setSelectedMealType}
            onClearFilters={handleClearFilters}
            onFavoriteFilterChange={(checked) =>
              setRecipeBox((currentBox) => ({
                ...currentBox,
                showFavoritesOnly: checked,
             
              }))
            
            }
          />
          <p>Showing {visibleRecipes.length} of {recipeBox.recipes.length} recipes</p>
          <p>Favorites: {favoriteCount}</p>
          <RecipeList
            recipes={visibleRecipes}
            onFavoriteToggle={handleFavoriteToggle}
            onDeleteRecipe={handleDeleteRecipe}
          />
        </section>
      </section>
    </main>
  )
}

function RecipeForm({ formData, error, onFormChange, onAddRecipe }) {
  return (
    <form className="recipe-form" onSubmit={onAddRecipe}>
      <h2>Add Recipe</h2>
      {error && <p className="error-message">{error}</p>}

      <label>
        Recipe name
        <input
          name="title"
          value={formData.title}
          onChange={onFormChange}
          placeholder="Example: fried rice"
        />
      </label>

      <label>
        Category
        <select
          name="category"
          value={formData.category}
          onChange={onFormChange}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
          <option>Dessert</option>
        </select>
      </label>
      <label>
        Difficulty
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={onFormChange}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </label>
      <label>
        Meal type
        <select
          name="mealType"
          value={formData.mealType}
          onChange={onFormChange}
        >
          <option>Veg</option>
          <option>Non-Veg</option>
        </select>
      </label>
      <label>
        Notes
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onFormChange}
          placeholder="Write ingredients or steps"
        />
      </label>

      <button type="submit">Add recipe</button>
    </form>
  )
}

function RecipeFilters({
  categories,
  activeFilter,
  selectedDifficulty,
  selectedMealType,
  showFavoritesOnly,
  onFilterChange,
  onDifficultyChange,
  onMealTypeChange,
  onClearFilters,
  onFavoriteFilterChange,
}) {
  return (
    <div className="filters">
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            className={category === activeFilter ? 'active' : ''}
            key={category}
            type="button"
            onClick={() => onFilterChange(category)}
          >
            {category}
          </button>
          
        ))}
       
      </div>
      <div className="difficulty-filters">
          {['All', 'Easy', 'Medium', 'Hard'].map((level) => (
            <button 
              key={level} 
              type="button"
              onClick={() => onDifficultyChange(level)}
              className={selectedDifficulty === level ? 'active' : ''}
            >
              {level}
            </button>
          ))}
     </div>
      <div className="meal-type-filters">
        {['All', 'Veg', 'Non-Veg'].map((mealType) => (
          <button
            key={mealType}
            type="button"
            onClick={() => onMealTypeChange(mealType)}
            className={selectedMealType === mealType ? 'active' : ''}
          >
            {mealType}
          </button>
        ))}
      </div>
       
      <label className="favorite-filter">
        <input
          type="checkbox"
          checked={showFavoritesOnly}
          onChange={(event) => onFavoriteFilterChange(event.target.checked)}
        />
        Favorites only
      </label>
      <button type="button" onClick={onClearFilters}>
        Clear filters
      </button>
    </div>
  )
}

function RecipeList({ recipes, onFavoriteToggle, onDeleteRecipe }) {
  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <h2>No recipes found</h2>
        <p>Try another category or turn off the favorites filter.</p>
      </div>
    )
  }

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <article className="recipe-card" key={recipe.id}>
          <div>
            <p className="category">{recipe.category}</p>
            <h2>{recipe.title}</h2>
            <p>{recipe.notes}</p>
            <p>Difficulty: {recipe.difficulty}</p>
            <p>Meal type: {recipe.mealType}</p>
          </div>

          <div className="card-actions">
            <button type="button" onClick={() => onFavoriteToggle(recipe.id)}>
              {recipe.isFavorite ? 'Remove favorite' : 'Mark favorite'}
            </button>
            <button type="button" onClick={() => onDeleteRecipe(recipe.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default App
