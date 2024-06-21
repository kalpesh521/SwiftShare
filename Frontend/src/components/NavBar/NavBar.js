import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import signout_icon from "../../assets/images/exit.png";
import logo from "../../assets/images/file-storage.png";
import signin_icon from "../../assets/images/people.png";
import "./NavBar.css";

const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken && refreshToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  const redirectTologin = () => {
    navigate("/signin");
  };

  const handleSignout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        await axios.post(
          "http://127.0.0.1:8000/logout/",
          { refresh: refreshToken },
          config
        );
        navigate("/signin");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        toast.success("Logged Out Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("Log out successful!");
      }
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message);
      toast.error("Failed to logout. Please try again later.");
    }
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
            to={isLoggedIn ? "/home" : "/"}
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
        {!isLoggedIn ? (
          <li className="nav-signin" onClick={redirectTologin}>
            <img src={signin_icon} alt="Sign In" className="nav-signin-logo" />
            Sign In
          </li>
        ) : (
          <li className="nav-signin" onClick={handleSignout}>
            <img
              src={signout_icon}
              alt="Sign Out"
              className="nav-signout-logo"
            />
            Sign Out
          </li>
        )}
      </ul>
    </div>
  );
};

export default NavBar;
