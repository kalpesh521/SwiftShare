import React, { useEffect, useState } from "react";
import chatIcon from "../../assets/images/chat.png"; // Ensure you have this icon in your assets folder
import "./chatbot.css";
import { RingLoader } from 'react-spinners';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handle = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "http://127.0.0.1:8000/enterroom";
    }, 3000);  
  };

  useEffect(() => {
    let openTimer, closeTimer;

    const cycle = () => {
      if (cycleCount < 10) {
        openTimer = setTimeout(() => {
          setIsOpen(true);
          closeTimer = setTimeout(() => {
            setIsOpen(false);
            setCycleCount(cycleCount + 1);
          }, 3000);
        }, 1000);
      }
    };

    cycle();

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [cycleCount]);

  return (
    <div className="chatbot-container">
      {isLoading && (
        <div className="loading-overlay">
          <RingLoader color="white" size={120} />
         </div>
      )}
      {isOpen && (
        <div className={`chatbot-bubble ${isOpen ? "open" : ""}`}>
          <p>
            We're Online!
            <br />
            How may I help you?
          </p>
        </div>
      )}
      <div className="chatbot-icon" onClick={handle}>
        <img src={chatIcon} alt="Chatbot Icon" />
      </div>
    </div>
  );
};

export default Chatbot;
