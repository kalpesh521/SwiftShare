import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt, FaLink } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import "./Home.css";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [email, setEmail] = useState("");

  const upload_file = async () => {
    try {
      var formdata = new FormData();

      for (var i = 0; i < files.length; i++) {
        formdata.append("files", files[i]);
      }

      const response = await fetch("http://127.0.0.1:8000/handle/", {
        method: "POST",
        body: formdata,
      });

      const result = await response.json();
      console.log(result);

      // Handle response accordingly (e.g., update UI, redirect, etc.)
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  
  const fileSize = (fileSize) => {
    if (fileSize >= 1073741824) {
      return (
        <p style={{ width: "100px" }}>
          {(fileSize / 1073741824).toFixed(2)} GB
        </p>
      );
    } else if (fileSize >= 52428800) {
      return (
        <p style={{ width: "100px" }}>{(fileSize / 1048576).toFixed(2)} MB</p>
      );
    } else if (fileSize >= 1024) {
      return (
        <p style={{ width: "100px" }}>{(fileSize / 1024).toFixed(2)} KB</p>
      );
    }
  };

  const deleteFile = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <div className="home-container">
      <div className="upload-container">
        <div>
          <input
            multiple
            type="file"
            id="fileInput"
            className="hidden"
            style={{ display: "none" }}
            onChange={(e) => {
              setFiles([...e.target.files]);
            }}
          />
          <label htmlFor="fileInput" className="primary-btn">
            <FaCloudUploadAlt size={20} />
            Add files
          </label>
        </div>
      </div>

      <div className="display-files">
        <div className="display-files-header">
          <p style={{ width: "150px", textAlign: "center" }}>Name</p>
          <p>Size</p>
          <p>Delete</p>
        </div>
        <div className="display-files-content">
          {files.length !== 0 &&
            Array.prototype.slice.call(files).map((file) => {
              return (
                <div className="file-item">
                  <p
                    style={{
                      fontSize: "13px",
                      width: "200px",
                      height: "35px",
                      overflow: "hidden",
                    }}
                  >
                    {file !== undefined ? file.name : ""}
                  </p>
                  {file !== undefined ? fileSize(file.size) : null}
                  <button
                    className="delete-button"
                    onClick={() => {
                      deleteFile(file.name);
                    }}
                  >
                    <FaTrash size={15} color="red" />
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      <div className="recipients-email-container">
        <p style={{ fontSize: "14px" }}>Enter recipient's email: </p>
        <input
          className="recipients-email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div className="">
        <button
          onClick={upload_file}
          className={`${
            !(files.length && email) ? "disabled-btn" : "primary-btn"
          }`}
        >
          <FaLink size={18} />
          Get link
        </button>
      </div>
    </div>
  );
}
