import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../App.css";
import basestyle from "./Base.module.css";
import loginstyle from "./login.module.css";

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
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

  const loginHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
    // if (!formErrors) {

    // }
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      axios.post("http://localhost:9002/login", user).then((res) => {
        alert(res.data.message);
        setUserState(res.data.user);
        navigate("/", { replace: true });
      });
    }
  }, [formErrors]);
  return (
    <div className={loginstyle.login}>
      <form>
        <h1 style={{ marginTop: -10, marginBottom: 30 }}>Welcome Back</h1>
        <p>Please Sign In</p>
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
          onClick={loginHandler}
          style={{ display: "block", margin: "20px auto 0" }}
        >
          SIGN IN
        </button>
      </form>
      <div style={{ display: "inline  " }}>
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
