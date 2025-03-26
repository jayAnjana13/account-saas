import React from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import routes, { renderRoutes } from "./routes";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

const App = () => {
  routes.forEach((route) => {
    if (!route.element) {
      console.error(`Route at path ${route.path} has an invalid element.`);
    }
  });

  return (
    <>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </>
  );
};

export default App;
