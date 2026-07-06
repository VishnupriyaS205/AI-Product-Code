import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import listings from "../data/listings.js";

function InquiryPage() {
  const { listingId } = useParams();

  const listing = listings.find((item) => item.id === Number(listingId));

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successText, setSuccessText] = useState("");
  if (!listing) {
    return <h2>Rental not found</h2>;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      return;
    }
    setSuccessText("Your submission was successful! Reloading the page...");
    setIsSubmitted(true);
    setName("");
    setMessage("");
  }

  return (
    <section>
      <h2>Send Inquiry For {listing.title}</h2>
      {isSubmitted && (
        <div>
          <p>{successText}</p>
          <p>Thank you, {name}. Your inquiry has been recorded.</p>
          <p>Your message: {message}</p>
          <Link className="text-link" to="/listings">
            Back to listings
          </Link>
        </div>
      )}
      <form className="inquiry-form" onSubmit={handleSubmit}>
        <label>
          Your name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>

        <button type="submit">Send inquiry</button>
      </form>
    </section>
  );
}

export default InquiryPage;
