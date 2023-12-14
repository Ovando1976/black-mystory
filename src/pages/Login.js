import React, { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
  // allows us to link with and track inputs (this could be done with state as well but it's heavier to process)
  const email = useRef();
  const password = useRef();
  const { isFetching, error, dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">FakBuk</h3>
          <span className="loginDescription">Connecting stuff</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleLogin}>
            <input
              placeholder="Email"
              type="email"
              className="loginInput"
              required
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              required
              minLength={6}
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress style={{ color: "white" }} size="20px" />
              ) : (
                "Login"
              )}
            </button>
            <span className="loginForgot">Forgot password?</span>
            <Link to="/register" className="loginRegisterLink">
              <button className="loginRegisterButton" disabled={isFetching}>
                {isFetching ? (
                  <CircularProgress style={{ color: "white" }} size="20px" />
                ) : (
                  "Create Account"
                )}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
