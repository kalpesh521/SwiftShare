import React from "react";
import { PiFilesFill } from "react-icons/pi";
import img1 from "../../assets/images/file-storage.png";
import img2 from "../../assets/images/file-storage.png";
import img3 from "../../assets/images/file-storage.png";
import "./Services.css"; 

const Services = () => {
  return (
    <div className="services-container">
      <div className="service-card">
        <div className="service-icon">
          <img src={img1} alt="Service 1 Image" />
        </div>
        <h3 className="service-title">Service 1</h3>
        <p className="service-description">Short description for Service 1</p>
      </div>
      <div className="service-card">
        <div className="service-icon">
        <img src={img2} alt="Service 1 Image" />
        </div>
        <h3 className="service-title">Service 2</h3>
        <p className="service-description">Short description for Service 2</p>
      </div>
      <div className="service-card">
        <div className="service-icon">
        <img src={img3} alt="Service 1 Image" />
        </div>
        <h3 className="service-title">Service 3</h3>
        <p className="service-description">Short description for Service 3</p>
      </div>
    </div>
  );
};

export default Services;
