import { Link } from "react-router-dom";
function Navbar() {
    return (
        <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/home">Home</Link>
            <Link className="navbar-brand" to="/login">Login</Link>
            <Link className="navbar-brand" to="/register">Register</Link>
            <Link className="navbar-brand" to="/profile">Profile</Link>
            <Link className="navbar-brand" to="/logout">Logout</Link>
        </nav>
        </div>
    );
    
}

export default Navbar;