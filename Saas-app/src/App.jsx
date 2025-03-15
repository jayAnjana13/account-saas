import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "../src/components/navbar/Navbar";
import routes, { renderRoutes } from "./routes";

const App = () => {
  routes.forEach((route) => {
    if (!route.element) {
      console.error(`Route at path ${route.path} has an invalid element.`);
    }
  });

  return (
    <>
      {/* <Navbar />
      <Router>
        <Suspense fallback={<div>Loading...</div>}>{renderRoutes()}</Suspense>
      </Router> */}
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </>
  );
};

export default App;
