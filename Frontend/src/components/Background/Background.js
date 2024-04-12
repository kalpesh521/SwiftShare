import "./Background.css";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
const Background = ({heroCount}) => {
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
