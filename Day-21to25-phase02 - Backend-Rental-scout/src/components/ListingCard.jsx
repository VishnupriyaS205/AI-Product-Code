import { Link } from "react-router-dom";

function ListingCard({ listing, isSaved, onToggleSaved }) {
  return (
    <article className="listing-card">
      <img src={listing.image} alt={listing.title} />
      <h3>{listing.title}</h3>
      <p>{listing.city}</p>
      <p>{listing.type}</p>
      <p>Rs. {listing.price} per month</p>
      <p>{listing.bedrooms} bedroom(s)</p>
      <Link to={`/listings/${listing.id}`}>View details</Link>
      <button type="button" onClick={() => onToggleSaved(listing.id)}>
        {isSaved ? "Remove from saved" : "Save rental"}
      </button>
    </article>
  );
}

export default ListingCard;
