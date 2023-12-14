import React, {BrowserRouter,Routes,Route } from "react-router-dom";
import Header from "./components/header/Header";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/home";
import List from "./pages/List";
import Hotel from "./pages/hotel";
import Blog from "./pages/blog";
import User from "./pages/user.js";
import Groups from "./pages/groups";
import Events from "./pages/events";
import Booking from "./pages/booking";
import DriverProfile from "./pages/driverProfile";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<List />} />
          <Route path="/hotels/:id" element={<Hotel />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/user" element={<User />} />
          <Route path="/group/:id" element={<Groups/>} />
          <Route path="/groups" element={<Groups/>} />
          <Route path="/events" element={<Events />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/driverProfile" element={<DriverProfile/>} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
