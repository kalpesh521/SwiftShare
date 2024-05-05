import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import basestyle from "./Base.module.css";
import loginstyle from "./login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
    console.log(user);
  };
  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    if (isLoading) {
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", user);
      console.log("Response from backend:", response);

      localStorage.setItem("accessToken", response.data.tokens.access);
      console.log(response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
      console.log("Success!", response.data);

      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/", { replace: true });
    } catch (error) {
      if (error.response && error.response.data) {
        console.log("Error during registration!", error.response.data);
        toast.error(error.response.data.detail || "Error during registration!");
      } else {
        console.log("Error during registration!", error.message);
        toast.error("Error during registration!");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={loginstyle.login}
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: 70,
        marginLeft: 500,
      }}
    >
      <form>
        <h1>Welcome Back</h1>
        <p style={{ color: "grey", marginBottom: "20px" }}>
          Please signin to continue
        </p>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={changeHandler}
          value={user.email}
        />
        <p className={basestyle.error}>{formErrors.email}</p>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={changeHandler}
          value={user.password}
        />
        <p className={basestyle.error}>{formErrors.password}</p>

        <button
          className={basestyle.button_common}
          onClick={handleSubmit}
          style={{ display: "block", margin: "20px auto 0" }}
        >
          {isLoading ? <div className={basestyle.loader} /> : "SIGN IN"}
        </button>
      </form>
      <div>
        <NavLink to="/signup" style={{ textDecoration: "none", color: "grey" }}>
          {" "}
          Don't have an account?
        </NavLink>{" "}
        <NavLink
          to="/signup"
          style={{ textDecoration: "none", color: "#6834d4", fontWeight: 600 }}
        >
          Register Now
        </NavLink>
      </div>
    </div>
  );
};
export default Login;
