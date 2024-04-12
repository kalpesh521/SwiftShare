import logo from "../../assets/arrow_btn.png";
import "./NavBar.css";

const NavBar = () => {
  return (
    <div className="nav">
      <div className="nav-left">
        <img src={logo} alt="Logo" className="nav-logo" />
        <div className="nav-title">ShareLink</div>
      </div>
      <ul className="nav-menu">
        <li id="about">About</li>
        <li className="nav-signin">
          <img src={logo} alt="Sign In" className="nav-signin-logo" />
          Sign In
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
