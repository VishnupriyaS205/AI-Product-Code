import ListingCard from "../components/ListingCard.jsx";
import listings from "../data/listings.js";
import { useState } from "react";

function BrowsePage({ savedIds, onToggleSaved }) {
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredListings = listings.filter((listing) => {
    const matchesCity = cityFilter === "" || listing.city === cityFilter;

    const matchesType = typeFilter === "" || listing.type === typeFilter;

    return matchesCity && matchesType;
  });

  return (
    <>
      <h2>Browse Rentals</h2>
      <div className="filters">
        <label>
          City
          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
          >
            <option value="">All cities</option>
            <option value="Chennai">Chennai</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>
        </label>

        <label>
          Rental type
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="">All types</option>
            <option value="Studio">Studio</option>
            <option value="Apartment">Apartment</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            setCityFilter("");
            setTypeFilter("");
          }}
        >
          Reset filters
        </button>
      </div>
      {filteredListings.length === 0 ? (
        <p>No rentals match your filters.</p>
      ) : (
        <section className="listing-grid">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSaved={savedIds.includes(listing.id)}
              onToggleSaved={onToggleSaved}
            />
          ))}
        </section>
      )}
    </>
  );
}

export default BrowsePage;
