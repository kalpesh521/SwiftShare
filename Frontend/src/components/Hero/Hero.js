import { useNavigate } from "react-router";
import arrow_btn from "../../assets/images/arrow.png";
import "./Hero.css";

export default function Hero({ heroData, heroCount, setHeroCount }) {
  const navigate = useNavigate();
   const redirectToHome = () => {
    navigate("/home");
  };

  return (
    <div className="hero">
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div>
        <li className="hero-btn"  onClick={redirectToHome}>
          Get Started
          <img src={arrow_btn} alt="" className="hero-icon" />
        </li>
      </div>

      <div className="hero-dot-play">
        <ul className="hero-dots">
          <li
            onClick={() => setHeroCount(0)}
            className={heroCount === 0 ? "hero-dot orange" : "hero-dot"}
          ></li>
          <li
            onClick={() => setHeroCount(1)}
            className={heroCount === 1 ? "hero-dot orange" : "hero-dot"}
          ></li>
          <li
            onClick={() => setHeroCount(2)}
            className={heroCount === 2 ? "hero-dot orange" : "hero-dot"}
          ></li>
        </ul>
      </div>
    </div>
  );
}
