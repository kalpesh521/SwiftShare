import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // [1] Added useNavigate
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/SignUp";
import Download from "./pages/Download/Download";
import GetLink from "./pages/GetLink/GetLink";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userstate, setUserState] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  };

  return (
    <>
      {isLoading ? (
        <div style={loaderStyle}>
          {/* <RingLoader color="white" size={80} /> */}
        </div>
      ) : (
        <>
           
          <ToastContainer position="top-right" autoClose={5000} />
          <BrowserRouter>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/getlink" element={<GetLink />} />
              <Route path="/download" element={<Download />} />
              <Route
                path="/signin"
                element={<Login setUserState={setUserState} />}
              ></Route>
              <Route path="/signup" element={<Register />}></Route>
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </BrowserRouter>
        </>
      )}
    </>
  );
}

export default App;
