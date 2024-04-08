import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Download from "./pages/Download/Download";
import GetLink from "./pages/GetLink/GetLink";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/getlink" element={<GetLink />} />
          <Route path="/download" element={<Download />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
