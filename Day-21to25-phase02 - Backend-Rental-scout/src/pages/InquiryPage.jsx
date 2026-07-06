import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import listings from "../data/listings.js";
import { createInquiry } from "../api.js";

function InquiryPage() {
  const { listingId } = useParams();

  const listing = listings.find((item) => item.id === Number(listingId));

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [successText, setSuccessText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!listing) {
    return <h2>Rental not found</h2>;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessText("");
    setErrorText("");

    if (!name.trim() || !message.trim()) {
      setErrorText("Please enter your name and message.");
      return;
    }

    try {
      setIsSubmitting(true);

      const inquiry = await createInquiry({
        listingId: listing.id,
        name,
        message,
      });

      setSuccessText(`Thank you, ${inquiry.name}. Your inquiry was sent.`);
      setName("");
      setMessage("");
    } catch (err) {
      setErrorText(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Send Inquiry For {listing.title}</h2>
      {successText && (
        <div>
          <p>{successText}</p>
          <Link className="text-link" to="/listings">
            Back to listings
          </Link>
        </div>
      )}
      {errorText && <p>{errorText}</p>}
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send inquiry"}
        </button>
      </form>
    </section>
  );
}

export default InquiryPage;
