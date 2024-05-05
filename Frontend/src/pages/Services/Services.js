import React from "react";
import { PiFilesFill } from "react-icons/pi";
import img1 from "../../assets/images/folder.png";
import img2 from "../../assets/images/database.png";
import img3 from "../../assets/images/email.png";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-container">
      <div className="service-card">
        <div className="service-icon">
          <img src={img1} alt="Service 1 Image" />
        </div>
        <h3 className="service-title">Faster sharing</h3>
        <h3 style={{marginTop:-15}}className="service-title">However big your idea </h3>
        <p className="service-description">
          Use SwiftShare to move creative assets, large files, whole folders and
          entire projects all at the touch of a button
        </p>
      </div>
      <div className="service-card">
        <div className="service-icon">
          <img src={img2} alt="Service 1 Image" />
        </div>
        <h3 className="service-title">Secure File Transfer</h3>
        <p className="service-description">
          {" "}
          Our secure file transfer service employs advanced encryption and
          security protocols to protect your files during transit. With
          SwiftShare, you can share sensitive information with confidence.
        </p>
      </div>
      <div className="service-card">
        <div className="service-icon">
          <img src={img3} alt="Service 1 Image" />
        </div>
        <h3 className="service-title">Direct Email-Link Sharing</h3>
        <p className="service-description">
          Simply generate a secure link and share it with your intended
          recipients via an innovative email-free sharing option.
        </p>
      </div>
    </div>
  );
};

export default Services;
