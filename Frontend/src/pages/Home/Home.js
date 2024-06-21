import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Home.css";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const upload_file = async () => {
    try {
      var formdata = new FormData();
      const token = localStorage.getItem('accessToken');
      for (var i = 0; i < files.length; i++) {
        formdata.append("files", files[i]);
      }
      formdata.append("email", email); // Add the recipient's email to the form data
      if (isLoading) {
        return;
      }
      setLoading(true);

      // First request to upload files
      const response = await fetch("http://127.0.0.1:8000/handle/", {
        method: "POST",
        body: formdata,
        headers: {
          'Authorization': `Bearer ${token}`,  
        },
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      const folderId = result.data.folder; // Assuming your backend returns the folder ID in this format
      console.log(folderId);

      // Second request to get the signed URL and send the email
      const getLinkResponse = await fetch(`http://127.0.0.1:8000/handle/${folderId}/get_sign_url/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }) // Send the recipient's email in the body
      });

      if (!getLinkResponse.ok) {
        throw new Error("Failed to get signed URL");
      }

      const linkResult = await getLinkResponse.json();
      console.log(linkResult);
      const signedUrl = linkResult.detail;
      const expirationDateStr = linkResult.expiration_date;
      console.log(expirationDateStr);
      console.log(signedUrl);

      toast.success("Your Link is Ready!!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/getlink", { state: { url: signedUrl, expiration_date: expirationDateStr } });

    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files or generating link");
    } finally {
      setLoading(false);
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
          <p style={{ width: "100px", textAlign: "center" }}>Name</p>
          <p style={{ marginLeft: "90px", textAlign: "center" }}>Size</p>
          <p style={{ width: "70px", textAlign: "center" }}>Delete</p>
        </div>
        <div className="display-files-content">
          {files.length !== 0 &&
            Array.prototype.slice.call(files).map((file) => {
              return (
                <div className="file-item" key={file.name}>
                  <p
                    style={{
                      fontSize: "14px",
                      width: "220px",
                      height: "20px",
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
        <p style={{ fontWeight: 600, fontSize: "14px" }}>
          Enter Recipient's Email :{" "}
        </p>
        <input
          className="recipients-email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div>
        <button
          type="submit"
          className={`${
            !(files.length && email) ? "disabled-btn  " : "primary-btn  "
          }`}
          disabled={isLoading}
          onClick={upload_file}
        >
          {isLoading ? <div id="loader" /> : " GET LINK"}
        </button>
      </div>
    </div>
  );
}
