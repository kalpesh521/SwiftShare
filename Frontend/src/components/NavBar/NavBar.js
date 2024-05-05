import { useNavigate } from "react-router";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/file-storage.png";
import signin_icon from "../../assets/images/people.png";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const redirectTologin = () => {
    navigate("/signin");
  };
  return (
    <div className="nav">
      <div  className="nav-left">
        <Link style={{textDecoration:"none",color:"#FDDE55"}} to="/">
          <img src={logo} alt="Logo" className="nav-logo" />
          <div className="nav-title">SwiftShare</div>
        </Link>
      </div>
      <ul className="nav-menu">
        <li id="menu">
          <Link to="/home" className="menu">
            Home
          </Link>
        </li>
        <li id="menu">
          <Link to="/services" className="menu">
            Services
          </Link>
        </li>
        <li id="menu">
          <Link to="/about" className="menu">
            About
          </Link>
        </li>
        <li id="menu">
          <NavLink to="/contact" className="menu">
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
