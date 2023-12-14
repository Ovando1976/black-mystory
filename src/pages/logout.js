import React, { useEffect } from "react";
import { logoutUser, navigate } from "../auth"; // Replace with your actual logout logic and navigate function

const Logout = () => {
  useEffect(() => {
    logoutUser();
    navigate("/"); // Replace with the desired route after successful logout
  }, []);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
