import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import basestyle from "./Base.module.css";
import registerstyle from "./SignUp.module.css";
 
const Register = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [user, setUserDetails] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
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
    if (!values.username) {
      error.username = "Name is required";
    }

    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password1) {
      error.password1 = "Password is required";
    } else if (values.password1.length < 4) {
      error.password1 = "Password must be more than 4 characters";
    } else if (values.password1.length > 10) {
      error.password1 = "Password cannot exceed more than 10 characters";
    }
    if (!values.password2) {
      error.password2 = "Confirm Password is required";
    } else if (values.password2 !== values.password1) {
      error.password2 = "Confirm password and password should be same";
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
      const response = await axios.post(
        "http://127.0.0.1:8000/register/",
        user
      );
      console.log("Success!", response.data);
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000, // Adjust as needed
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/signin", { replace: true });
    } catch (error) {
      console.log("Error during registration!", error.response?.data);
      toast.error("Error during registration!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={registerstyle.register} style={{display:"flex", justifyContent:"center", alignItems:"center",marginTop:50, marginLeft:500}}>
      
        <form>
          <h1 style={{ fontSize: 30, marginTop: -10, marginBottom: 30 }}>
            Create Your Account
          </h1>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Name"
            onChange={changeHandler}
            value={user.username}
          />
          <p className={basestyle.error}>{formErrors.username}</p>

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
            name="password1"
            id="password1"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password1}
          />
          <p className={basestyle.error}>{formErrors.password1}</p>
          <input
            type="password"
            name="password2"
            id="password2"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={user.password2}
          />
          <p className={basestyle.error}>{formErrors.password2}</p>
          <button
            type="submit"
            className={basestyle.button_common}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? <div className={basestyle.loader} /> : "REGISTER"}
          </button>
        </form>{" "}
        <div style={{ display: "inline  " }}>
          <NavLink
            to="/signin"
            style={{ textDecoration: "none", color: "grey" }}
          >
            Already registered?
          </NavLink>{" "}
          <NavLink
            to="/signin"
            style={{
              textDecoration: "none",
              color: "#6834d4",
              fontWeight: 600,
            }}
          >
            Login
          </NavLink>
        </div>
      </div>
    </>
  );
};
export default Register;
