import React from "react";
import Navigation from "../components/navbar/Navbar";
import { Container } from "react-bootstrap";

const AdminLayout = ({ children }) => {
  let common = (
    <React.Fragment>
      <Navigation />
    </React.Fragment>
  );

  let mainContainer = <React.Fragment>{children}</React.Fragment>;

  return (
    <React.Fragment>
      {common}
      <Container
        className="p-4 my-4 rounded shadow"
        style={{ backgroundColor: "#e9ecef" }}
      >
        {mainContainer}
      </Container>
    </React.Fragment>
  );
};

export default AdminLayout;
