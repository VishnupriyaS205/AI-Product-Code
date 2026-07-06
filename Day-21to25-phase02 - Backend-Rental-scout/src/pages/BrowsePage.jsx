import ListingCard from "../components/ListingCard.jsx";
import { getListings } from "../api.js";
import { useEffect, useState } from "react";

function BrowsePage({ savedIds, onToggleSaved }) {
  const [listings, setListings] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await getListings();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadListings();
  }, []);

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
      {isLoading ? (
        <p>Loading listings...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredListings.length === 0 ? (
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
