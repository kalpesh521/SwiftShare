import React, { useState } from "react";
import { FaArrowUpRightFromSquare, FaCopy, FaRegClock } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GetLink.css";

export default function GetLink() {
  const location = useLocation();
  const generatedUrl = location.state.url;
  const expirationDateStr = location.state.expiration_date; // Get expiration date from state
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const baseUrl = new URL(generatedUrl).origin;

  const handleOpenLink = () => {
    setLoading(true);
    setShowLoader(true);
    setTimeout(() => {
      setLoading(false);
      setShowLoader(false);
      window.open(generatedUrl, "_blank");
    }, 3000);
  };

  const loaderStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
  };

  return (
    <div className="getlink-container" style={{ marginTop: 60, marginLeft: 425 }}>
      {showLoader && (
        <div style={loaderStyle}>
          <RingLoader color="white" size={80} />
        </div>
      )}
      <p style={{ fontSize: "24px", fontWeight: "600" }}>Your link is ready!</p>
      <p id="subtittle">The download link for your transfer is available</p>
      <p id="subtittle">for only 7 days</p>
      <p id="expiration">
        <FaRegClock style={{ marginRight: 5}} />
        Expires on: {expirationDateStr}
      </p>
      <p>You can copy the following URL and share it.</p>
      <div className="link-container">
        <div id="link">
          <span>{baseUrl}</span>
        </div>
        <button
          className="icon-container"
          onClick={() => {
            navigator.clipboard.writeText(generatedUrl);
            toast.success("Link copied successfully!!", {
              theme: "light",
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }}
        >
          <FaCopy size={20} color="dodgerblue" className="getlink-icon" />
        </button>

        {loading ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RingLoader color="white" size={20} />
          </div>
        ) : (
          <button className="icon-container" onClick={handleOpenLink}>
            <FaArrowUpRightFromSquare
              size={20}
              color="dodgerblue"
              className="getlink-icon"
            />
          </button>
        )}
      </div>
    </div>
  );
}
