import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Background from "./components/Background/Background";
import Hero from "./components/Hero/Hero";
import NavBar from "./components/NavBar/NavBar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/SignUp";
import Download from "./pages/Download/Download";
import GetLink from "./pages/GetLink/GetLink";
import Home from "./pages/Home/Home";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userstate, setUserState] = useState({});
  const [heroCount, setHeroCount] = useState(2);

  let heroData = [
    { text1: "Kalpesh", text2: "Pawar" },
    { text1: "Virat ", text2: "Kohli" },
    { text1: "Rohit  ", text2: "Sharma" },
  ];

  useEffect(() => {
    setInterval(() => {
      setHeroCount((count) => {
        return count === 2 ? 0 : count + 1;
      });
    }, 3000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
          {" "}
          <Background heroCount={heroCount} />
          <NavBar />
          <Hero
            heroCount={heroCount}
            heroData={heroData[heroCount]}
            setHeroCount={setHeroCount}
          />
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
            </Routes>
          </BrowserRouter>
        </>
      )}
    </>
  );
}

export default App;
