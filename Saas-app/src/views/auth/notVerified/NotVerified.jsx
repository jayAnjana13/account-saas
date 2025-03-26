import React from "react";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const NotVerified = () => {
  return (
    <React.Fragment>
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
              <h5 className="my-4">We have sent an email for verification.</h5>
              <h6 className="my-3">Please check your inbox.!</h6>
              <p className="mb-0 text-muted">
                Verified?{" "}
                <NavLink to="/auth/signin" className="f-w-400">
                  Signin
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NotVerified;
