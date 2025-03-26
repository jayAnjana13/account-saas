import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role from localStorage
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          Taxify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">
              Home
            </Nav.Link>

            {userRole === "CA" && (
              <Nav.Link as={Link} to="/clients/client-list">
                Clients
              </Nav.Link>
            )}
            {userRole === "CA" && (
              <Nav.Link as={Link} to="/billings/invoices">
                Billing
              </Nav.Link>
            )}

            {/* Billing - Visible to CA  */}
            {/* {userRole === "CA" && (
              <Dropdown>
                <Dropdown.Toggle variant="transparent" id="billing-dropdown">
                  Billing
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/billings/dashboard">
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/billings/invoices">
                    Invoices
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )} */}

            {userRole === "Client" && (
              <Nav.Link as={Link} to="/invoice">
                Invoices
              </Nav.Link>
            )}

            {/* Profile - Visible to both CA and Clients */}
            {userRole === "CA" && (
              <Nav.Link as={Link} to="/profiles/profile">
                Profile
              </Nav.Link>
            )}

            {/* Logout */}
            <Nav.Link as={Link} to="/logout">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
