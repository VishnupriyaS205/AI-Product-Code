import { Link, useParams } from "react-router-dom";
import listings from "../data/listings.js";

function DetailPage() {
  const { listingId } = useParams();

  const listing = listings.find((item) => item.id === Number(listingId));

  if (!listing) {
    return <h2>Rental not found</h2>;
  }

  return (
    <section>
      <img className="detail-image" src={listing.image} alt={listing.title} />
      <h2>{listing.title}</h2>
      <p>{listing.city}</p>
      <p>{listing.type}</p>
      <p>Rs. {listing.price} per month</p>
      <p>{listing.bedrooms} bedroom(s)</p>
      <p>{listing.furnished ? "Furnished" : "Not furnished"}</p>
      <p>{listing.description}</p>

      <Link to={`/listings/${listing.id}/apply`}>Send inquiry</Link>
    </section>
  );
}

export default DetailPage;
