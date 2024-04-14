import axios from "axios";
import React, { useEffect, useState } from "react";
import basestyle from "./Base.module.css";
import registerstyle from "./SignUp.module.css";
import { FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
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
    if (!values.name) {
      error.name = "First Name is required";
    }

    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm password and password should be same";
    }
    return error;
  };
  const signupHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
    // if (!formErrors) {
    //   setIsSubmit(true);
    // }
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(user);
      axios.post("http://localhost:9002/signup/", user).then((res) => {
        alert(res.data.message);
        navigate("/login", { replace: true });
      });
    }
  }, [formErrors]);
  return (
    <>
      <div className={registerstyle.register}>
      <FaTimes  
          className={basestyle.icon}
          onClick={() => navigate("/")}
        />
        <form>
          <h1 style={{ marginTop: -10, marginBottom: 30 }}>CREATE ACCOUNT</h1>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            onChange={changeHandler}
            value={user.fname}
          />
          <p className={basestyle.error}>{formErrors.name}</p>

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
          <input
            type="password"
            name="cpassword"
            id="cpassword"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={user.cpassword}
          />
          <p className={basestyle.error}>{formErrors.cpassword}</p>
          <button className={basestyle.button_common} onClick={signupHandler}>
            REGISTER
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
            style={{ textDecoration: "none", color: "#6834d4", fontWeight: 600 }}
          >
            Login
          </NavLink>
        </div>
      </div>
    </>
  );
};
export default Register;
