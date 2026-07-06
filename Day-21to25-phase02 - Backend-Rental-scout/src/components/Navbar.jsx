import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>Rental Scout</h1>

      <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/listings">Browse</NavLink>
        <NavLink to="/saved">Saved</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
