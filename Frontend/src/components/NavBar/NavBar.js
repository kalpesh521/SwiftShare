import { useLocation ,useNavigate} from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/file-storage.png";
import signin_icon from "../../assets/images/people.png";
import "./NavBar.css";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectTologin = () => {
    navigate("/signin");
  };

  return (
    <div className="nav">
      <div className="nav-left">
        <Link style={{ textDecoration: "none", color: "#FDDE55" }} to="/">
          <img src={logo} alt="Logo" className="nav-logo" />
          <div className="nav-title">SwiftShare</div>
        </Link>
      </div>
      <ul className="nav-menu">
        <li id="menu">
          <NavLink
            to="/home"
            className="menu"
            activeClassName={location.pathname === "/home" ? "active" : ""}
          >
            Home
          </NavLink>
        </li>
        <li id="menu">
          <NavLink
            to="/services"
            className="menu"
            activeClassName={location.pathname === "/services" ? "active" : ""}
          >
            Services
          </NavLink>
        </li>
        <li id="menu">
          <NavLink
            to="/about"
            className="menu"
            activeClassName={location.pathname === "/about" ? "active" : ""}
          >
            About
          </NavLink>
        </li>
        <li id="menu">
          <NavLink
            to="/contact"
            className="menu"
            activeClassName={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </NavLink>
        </li>
        <li className="nav-signin" onClick={redirectTologin}>
          <img src={signin_icon} alt="Sign In" className="nav-signin-logo" />
          Sign In
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
