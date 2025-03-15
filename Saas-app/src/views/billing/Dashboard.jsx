import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import growth from "../../assets/images/growth.svg";
import donutchart from "../../assets/images/donutchart.svg";
const Dashboard = () => {
  return (
    <>
      <React.Fragment>
        <Row>
          <Col md={2}>
            <h5>
              <b>Billing Dashboard</b>
            </h5>
          </Col>
        </Row>

        <hr />
        <Row>
          <Col md={4}>
            <Card style={{ height: "200px", textAlign: "center" }}>
              <Card.Body style={{ alignContent: "center" }}>
                <div className="text-center mb-3">
                  <img src={growth} alt="growth" />
                </div>
                <h6>
                  <b>Track your Revenue</b>
                </h6>
                <p>
                  <small>
                    The revenue chart will update every month with collected
                    revenue to show how quickly you are growing.
                  </small>
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5} style={{ alignContent: "center", textAlign: "center" }}>
            <Row>
              <Col>
                <Card style={{ height: "80px" }}>
                  <Card.Body>
                    <h4>$ 0</h4>
                    <p>Total Past Due</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card style={{ height: "80px" }}>
                  <Card.Body>
                    <h4>$ 0</h4>
                    <p>Total Outstanding</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            <Card
              style={{
                height: "200px",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              <Card.Body style={{ alignContent: "center" }}>
                <div className="text-center mb-3">
                  <img src={donutchart} alt="growth" />
                </div>
                <h6>
                  <b>We need more information</b>
                </h6>
                <p>
                  <small>Begin creating invoices now</small>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card
              style={{
                height: "350px",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              <Card.Body style={{ alignContent: "center" }}>
                <div className="text-center mb-3">
                  <img src={growth} alt="growth" />
                </div>
                <h6>
                  <b>Outstanding Invoices</b>
                </h6>
                <p>
                  <small>No outstanding invoices</small>
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              style={{
                height: "350px",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              <Card.Body style={{ alignContent: "center" }}>
                <div className="text-center mb-3">
                  <img src={donutchart} alt="growth" />
                </div>
                <h6>
                  <b>Recurring Invoices</b>
                </h6>

                <p>
                  <small>There are no recurring invoices</small>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    </>
  );
};

export default Dashboard;
