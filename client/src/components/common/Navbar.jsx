import { Link } from "react-router-dom";
import "./Navbar.css";
const Navbar = ( isLoggedIn ) => {
    const onLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="logo">My App</div>

      {isLoggedIn ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <button>Login</button>
      )}
      <Link className="navbar-brand" to="/home">
        Home
      </Link>
      <Link className="navbar-brand" to="/login">
        Login
      </Link>
      <Link className="navbar-brand" to="/register">
        Register
      </Link>
      <Link className="navbar-brand" to="/profile">
        Profile
      </Link>
      <Link className="navbar-brand" to="/">
        Logout
      </Link>
    </nav>
  );
}

export default Navbar;
