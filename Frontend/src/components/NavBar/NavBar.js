import { useNavigate } from "react-router";
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
      <div className="nav-left">
        <img src={logo} alt="Logo" className="nav-logo" />
        <div className="nav-title">SwiftShare</div>
      </div>
      <ul className="nav-menu">
        <li id="menu">About</li>
        <li id="menu">Contact us</li>
        <li className="nav-signin" onClick={redirectTologin}>
          <img src={signin_icon} alt="Sign In" className="nav-signin-logo" />
          Sign In
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
