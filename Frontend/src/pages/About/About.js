import React from "react";
// import Image from "../../Assets/Man-working-on-laptop-icon-illustration-on-transparent-background-PNG.png";
import Feature from "./Feature";
import "./About.css";
import logo from "../../assets/images/about.jpg";

function About() {
  return (
    <div className="about-section" >
      <div className="about-image-content">
        <img src={logo} alt="Doctor Group" className="about-image1" />
      </div>

      <div className="about-text-content">
        <h3 className="about-title">
          <span>About Us</span>
        </h3>
        <p className="about-description">
        Welcome to SwiftShare, your ultimate solution for fast, secure, and hassle-free file sharing. At SwiftShare, we understand the importance of sharing files efficiently while prioritizing security and user experience. Our platform is designed to provide you with the simplest and fastest interface to share large files securely with your recipients.
         </p>

        <Feature
          title="Get Started with SwiftShare : "
          description="Ready to experience the simplicity and security of SwiftShare? Sign up today and start sharing files with confidence. Whether you're collaborating with colleagues, sharing memories with friends, or distributing content to clients, SwiftShare has you covered.

          Join SwiftShare now and elevate your file sharing experience to new heights!"
        />

         
      </div>
    </div>
  );
}

export default About;