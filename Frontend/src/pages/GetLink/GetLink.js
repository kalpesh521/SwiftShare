import React from "react";
import { FaCopy } from "react-icons/fa6";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GetLink.css";
import { useLocation } from "react-router-dom";


export default function GetLink() {
  const location = useLocation();
  const generatedUrl = location.state.url;
  console.log("Generated Url : " + generatedUrl);

  return (
    <div className="getlink-container">
      <p style={{ fontSize: "20px", fontWeight: "600" }}>Your link is ready!</p>
      <div className="link-container">
        <a href={generatedUrl}>{generatedUrl}</a>
        <button
          className="delete-button"
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
          <FaCopy size={20} color="dodgerblue" />
        </button>
      </div>
    </div>
  );
}
