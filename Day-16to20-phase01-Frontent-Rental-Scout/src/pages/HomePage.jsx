import { Link } from "react-router-dom";

function HomePage() {
  return (
        <section className="home-hero">
      <p className="eyebrow">Frontend-only rental finder</p>
      <h2>Find rentals, compare options, and save your favorites.</h2>
      <p>
        Rental Scout helps users browse local rentals, filter by city and type,
        save interesting places, and send a simple inquiry.
      </p>
      <Link to="/listings">Browse rentals</Link>
    </section>
  );
}

export default HomePage;
