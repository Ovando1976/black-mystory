import axios from "axios";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordRepeat = useRef();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // this event behaves a bit weird after the form is submitted unsusscessfully
    if (passwordRepeat.current.value !== password.current.value) {
      password.current.setCustomValidity("Passwords don't match.");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const res = await axios.post("/auth/register", user);

        navigate("/login");
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">FakBuk</h3>
          <span className="registerDescription">Connecting stuff</span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleRegister}>
            <input
              placeholder="Name"
              type="text"
              className="registerInput"
              required
              ref={username}
            />
            <input
              placeholder="Email"
              type="email"
              className="registerInput"
              required
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              className="registerInput"
              minLength={6}
              required
              ref={password}
            />
            <input
              placeholder="Password Again"
              type="password"
              className="registerInput"
              minLength={6}
              required
              ref={passwordRepeat}
            />
            <button className="registerButton" type="submit">
              Sign up
            </button>
            <Link to="/login" className="loginLink">
              <button className="registerRegisterButton">Log in</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}



