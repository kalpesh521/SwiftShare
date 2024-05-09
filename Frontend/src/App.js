import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import RingLoader from "react-spinners/RingLoader";
import NavBar from "./components/NavBar/NavBar";
import Services from "./pages/Services/Services";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/SignUp";
import Contact from "./pages/Contact/Contact";
import GetLink from "./pages/GetLink/GetLink";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/LandingPage/LandingPage";
import About from "./pages/About/About"
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userstate, setUserState] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

    const loaderStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "90vh",
    };

  return (
    <>
      {isLoading ? (
        <div style={loaderStyle}>
          <RingLoader color="white" size={120} />
        </div>
      ) : (
        <>
          <ToastContainer position="top-right" autoClose={5000} />

          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/getlink" element={<GetLink />} />
              <Route
                path="/signin"
                element={<Login setUserState={setUserState} />}
              ></Route>
              <Route path="/signup" element={<Register />}></Route>
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </BrowserRouter>
        </>
      )}
    </>
  );
}

export default App;
