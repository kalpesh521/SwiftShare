import React, { useEffect, useState } from "react";
import "./Download.css";
import { FaDownload } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function Download() {
  const [file, setFile] = useState({
    lastModified: 1711390184136,
    lastModifiedDate: "Mon Mar 25 2024 23:39:44 GMT+0530 (India Standard Time)",
    name: "Unit  2 question bank with solution.pdf",
    size: 130407,
    type: "application/pdf",
    webkitRelativePath: "",
  });

  const fileSize = (fileSize) => {
    if (fileSize >= 1073741824) {
      return (
        <p style={{ width: "100px", height: "50px" }}>
          {(fileSize / 1073741824).toFixed(2)} GB
        </p>
      );
    } else if (fileSize >= 52428800) {
      return (
        <p style={{ width: "100px", height: "50px" }}>{(fileSize / 1048576).toFixed(2)} MB</p>
      );
    } else if (fileSize >= 1024) {
      return (
        <p style={{ width: "100px", height: "50px" }}>{(fileSize / 1024).toFixed(2)} KB</p>
      );
    }
  };

  return (
    <div className="download-container">
      <p style={{ fontSize: "20px", fontWeight: "600" }}>File is ready!</p>
      <div className="download-file-container">
        <p style={{width: "80%", height: "50px"}}>{file.name}</p>
        <p style={{width: "20%"}}>{fileSize(file.size)}</p>
      </div>
      <button className="primary-btn">
        <FaDownload size={18} color="white" />
        Download   
      </button>
    </div>
  );
}
