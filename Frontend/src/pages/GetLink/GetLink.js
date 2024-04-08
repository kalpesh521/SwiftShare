import React, { useEffect, useState } from "react";
import "./GetLink.css";
import { FaCopy } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function GetLink() {
  const [link, setLink] = useState("https://google.com");

  return (
    <div className="getlink-container">
      <p style={{ fontSize: "20px", fontWeight: "600" }}>Your link is ready!</p>
      <div className="link-container">
        <a href={link}>{link}</a>
        <button
          className="delete-button"
          onClick={() => {
            navigator.clipboard.writeText(link);
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
