import axios from "axios";
import React, { useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import basestyle from "../../pages/Auth/Base.module.css";
import contactstyle from "../../pages/Auth/SignUp.module.css";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [user, setUserDetails] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
      error.name = "Please enter in required field";
    }
    if (!values.subject) {
      error.subject = "Please enter in required field";
    }
    if (!values.message) {
      error.message = "Please enter in required field";
    }

    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
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
      const response = await axios.post("http://127.0.0.1:8000/contact/", user);
      console.log("Success!", response.data);
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000, // Adjust as needed
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/contact", { replace: true });
    } catch (error) {
      console.log("Error during registration!", error.response?.data);
      toast.error("Error during registration!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={contactstyle.register}>
        <FaTimesCircle
          className={basestyle.icon}
          onClick={() => navigate("/")}
        />
        <form>
          <h1 style={{ marginTop: -10, marginBottom: 30 }}>CONTACT US</h1>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            onChange={changeHandler}
            value={user.name}
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
            type="text"
            name="subject"
            id="subject"
            placeholder="Subject"
            onChange={changeHandler}
            value={user.subject}
          />
          <p className={basestyle.error}>{formErrors.subject}</p>

          <input
            type="text"
            name="message"
            id="message"
            placeholder="Message"
            onChange={changeHandler}
            value={user.message}
          />
          <p className={basestyle.error}>{formErrors.message}</p>

          <button
            type="submit"
            className={basestyle.button_common}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? <div className={basestyle.loader} /> : "SEND"}
          </button>
        </form>{" "}
      </div>
    </>
  );
};
export default Contact;
