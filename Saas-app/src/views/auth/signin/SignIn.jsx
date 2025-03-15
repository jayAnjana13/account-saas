import React from "react";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

// import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import AuthLogin from "./JWTLogin";

const Signin = () => {
  return (
    <React.Fragment>
      {/* <Breadcrumb /> */}
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-left">
            <Card.Body>
              <div className="mb-4 text-center">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <h3 className="mb-4 text-center">Sign In</h3>

              <AuthLogin />
              <p className="mb-2 text-muted">
                Forgot password?{" "}
                <NavLink to={"/auth/forgot-password"} className="f-w-400">
                  Reset
                </NavLink>
              </p>
              <p className="mb-0 text-muted">
                Don’t have an account?{" "}
                <NavLink to="/auth/signup" className="f-w-400">
                  Signup
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin;
