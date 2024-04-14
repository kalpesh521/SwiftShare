import image1 from "../../assets/images/slide1.0.jpg";
import image2 from "../../assets/images/slide2.0.jpg";
import image3 from "../../assets/images/slide3.jpg";
import "./Background.css";
const Background = ({ heroCount }) => {
  if (heroCount === 0) {
    return <img src={image1} className="background" alt="" />;
  }
  if (heroCount === 1) {
    return <img src={image2} className="background" alt="" />;
  }
  if (heroCount === 2) {
    return <img src={image3} className="background" alt="" />;
  }
};
export default Background;
