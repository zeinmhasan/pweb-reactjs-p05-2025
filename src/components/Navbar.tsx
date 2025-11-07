// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/home" className="nav-logo">📚 Mystic Library</Link> {/* TAG: logo bertema magis */}
      </div>

      <div className="nav-right">
        <Link to="/books" className="nav-item">Books</Link>
        <Link to="/transactions" className="nav-item">Transactions</Link>
        <Link to="/genres" className="nav-item">Genres</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
