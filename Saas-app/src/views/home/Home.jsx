import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Dashboard from "../dashboard/Dashboard";

const Home = () => {
  return (
    <div>
      <Navbar />
      <h3>Home</h3>
      <Dashboard />
    </div>
  );
};

export default Home;
