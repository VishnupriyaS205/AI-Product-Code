import ListingCard from "../components/ListingCard.jsx";
import listings from "../data/listings.js";

function SavedPage({ savedIds, onToggleSaved }) {
  const savedListings = listings.filter((listing) =>
    savedIds.includes(listing.id),
  );

  return (
    <section>
      <h2>Saved Rentals</h2>

      {savedListings.length === 0 ? (
        <p>You have not saved any rentals yet.</p>
      ) : (
        <div className="listing-grid">
          {savedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSaved={true}
              onToggleSaved={onToggleSaved}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default SavedPage;
