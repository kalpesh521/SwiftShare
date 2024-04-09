import React from "react";
import { FaCopy, FaArrowUpRightFromSquare } from "react-icons/fa6";
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
      <p style={{ fontSize: "24px", fontWeight: "600" }}>Your link is ready!</p>
      <p id= "subtittle">The download link for your transfer is available  </p>
      <p id= "subtittle">for only 7 days</p>
       
      <p  >You can copy the following URL and share it .</p>
      <div className="link-container">
        <div id="link">{generatedUrl}</div>
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
          <div class="icon-container">
            <a href={generatedUrl}>
              <FaArrowUpRightFromSquare
                size={20}
                color="dodgerblue"
                class="icon"
              />
            </a>
            <FaCopy size={20} color="dodgerblue" class="icon" />
          </div>
        </button>
      </div>
    </div>
  );
}
