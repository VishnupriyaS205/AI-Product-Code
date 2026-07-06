import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { places } from "./data/places";
import { FilterBar } from "./components/FilterBar";
import { PlaceCard } from "./components/PlaceCard";
import { PlanPanel } from "./components/PlanPanel";
import { SummaryBar } from "./components/SummaryBar";
import { ResultSummary } from "./components/ResultSummary";
import EmptyState from "./components/EmptyState";
import {
  buildPlanItems,
  filterPlaces,
  getCategories,
  getCategoryCounts,
  getPlanSummary,
  sortPlaces,
} from "./utils/plannerUtils";

const STORAGE_KEY = "city-weekend-plan";

function getSavedPlan() {
  const savedPlan = localStorage.getItem(STORAGE_KEY);

  if (!savedPlan) {
    return {};
  }

  try {
    return JSON.parse(savedPlan);
  } catch {
    return {};
  }
}

function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [plan, setPlan] = useState(getSavedPlan);
  const [sortBy, setSortBy] = useState("default");
  const categories = getCategories(places);
  const visiblePlaces = useMemo(() => {
    const filteredPlaces = filterPlaces(places, searchText, selectedCategory);
    return sortPlaces(filteredPlaces, sortBy);
  }, [searchText, selectedCategory, sortBy]);
  const planItems = buildPlanItems(places, plan);
  const categoryCounts = getCategoryCounts(planItems);
  const summary = getPlanSummary(planItems);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  function handleSavePlace(placeId) {
    setPlan((currentPlan) => ({
      ...currentPlan,
      [placeId]: currentPlan[placeId] ?? { note: "" },
    }));
  }

  function handleRemovePlace(placeId) {
    setPlan((currentPlan) => {
      const nextPlan = { ...currentPlan };
      delete nextPlan[placeId];
      return nextPlan;
    });
  }

  function handleNoteChange(placeId, note) {
    setPlan((currentPlan) => ({
      ...currentPlan,
      [placeId]: {
        ...currentPlan[placeId],
        note,
      },
    }));
  }

  function handleResetFilters() {
    setSearchText("");
    setSelectedCategory("All");
    setSortBy("default");
  }

  function handleClearPlan() {
    const shouldClear = window.confirm("Clear your saved weekend plan?");

    if (shouldClear) {
      setPlan({});
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Week 3 Frontend Project</p>
          <h1>City Weekend Planner</h1>
          <p className="intro">
            Explore local places, filter the list, and save a simple weekend
            plan with notes.
          </p>
          <ResultSummary
            visibleCount={visiblePlaces.length}
            totalCount={places.length}
          />
        </div>
        <SummaryBar summary={summary} />
      </header>

      <section className="planner-grid" aria-label="Weekend planner">
        <div className="browse-panel">
          <FilterBar
            categories={categories}
            searchText={searchText}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchText}
            onCategoryChange={setSelectedCategory}
            onResetFilters={handleResetFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {visiblePlaces.length > 0 ? (
            <div className="place-grid">
              {visiblePlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSaved={Boolean(plan[place.id])}
                  onSave={handleSavePlace}
                  onRemove={handleRemovePlace}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No places found"
              message={
                searchText.trim()
                  ? `No places match "${searchText}". Try another search or reset filters.`
                  : "No places match this filter. Try another category or reset filters."
              }
              onReset={handleResetFilters}
              buttonText="Reset filters"
            />
          )}
        </div>
        <PlanPanel
          planItems={planItems}
          onRemove={handleRemovePlace}
          onNoteChange={handleNoteChange}
          onClearPlan={handleClearPlan}
          categoryCounts={categoryCounts}
        />
      </section>
    </main>
  );
}

export default App;
