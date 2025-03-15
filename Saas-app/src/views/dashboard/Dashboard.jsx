import React, { useEffect } from "react";
import { Card, Col, Row, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import growth from "../../assets/images/growth.svg";
import donutchart from "../../assets/images/donutchart.svg";
import clipboard from "../../assets/images/clipboard.svg";
import axios from "axios";

const Dashboard = () => {
  const [userName, setUserName] = React.useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/user/user-data/${localStorage.getItem("id")}`
        );
        setUserName(response.data.fullName);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <React.Fragment>
      <Row>
        <Col>
          <h5>
            Welcome,<b> {userName}</b>
          </h5>
          <hr />
          <Tabs variant="underline" defaultActiveKey="overview">
            <Tab eventKey="overview" title="Overview">
              <Row>
                <Col md={3}>
                  <Card className="border border-ternary rounded">
                    <Card.Header>
                      WEDNESDAY, SEPTEMBER
                      <br /> 18
                    </Card.Header>
                    <Card.Body className="text-center">
                      <i
                        className="feather icon-calendar"
                        style={{ fontSize: "60px" }}
                      />
                      <Card.Text>Your Schedule is open</Card.Text>
                      {/* <Button variant="primary" onClick={() => setModalShow(true)}>
                      Add an event
                    </Button> */}
                      {/* <Button variant="primary">Add an event</Button> */}
                    </Card.Body>
                  </Card>{" "}
                </Col>
                <Col md={9}>
                  <Card className="border border-ternary rounded mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <Card.Title>Task</Card.Title>
                      <Link>View all task</Link>
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={3}>
                          <Row style={{ fontSize: "24px" }}>
                            <b>0</b>
                          </Row>
                          <Row>Tasks overdue</Row>
                        </Col>
                        <Col md={3}>
                          <Row style={{ fontSize: "24px" }}>
                            <b>0</b>
                          </Row>
                          <Row>Due this week</Row>
                        </Col>
                        <Col md={3}>
                          <Row style={{ fontSize: "24px" }}>
                            <b>0</b>
                          </Row>
                          <Row>Due next week</Row>
                        </Col>
                        <Col md={3}>
                          <Row style={{ fontSize: "24px" }}>
                            <b>0</b>
                          </Row>
                          <Row>Future tasks</Row>
                        </Col>
                      </Row>
                      <div
                        style={{
                          position: "relative",
                          height: "40vh",
                          width: "100%",
                        }}
                      >
                        {/* <Line data={data} options={options} /> */}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="admin" title="Admin">
              <Row>
                <Col md={3}>
                  <Row>
                    {" "}
                    <Card className="border border-ternary rounded">
                      <Card.Header>
                        <Card.Title>Client Growth</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <div className="text-center mb-3">
                          <img src={growth} alt="growth" />
                        </div>
                        <Card.Subtitle className="mb-2">
                          Track your growth rate
                        </Card.Subtitle>
                        <Card.Text>
                          The growth rate chart will update monthly to show how
                          quickly you are growing.
                        </Card.Text>
                      </Card.Body>
                    </Card>{" "}
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Row>12.3%</Row>
                      <Row>Client growth rate</Row>
                    </Col>
                    <Col>Net new client</Col>
                  </Row>
                  <Row>
                    {" "}
                    <Card className="border border-ternary rounded">
                      <Card.Header>
                        <Card.Title>Client Sources</Card.Title>
                      </Card.Header>
                      <Card.Body className="text-center">
                        <div className=" mb-3">
                          <img src={donutchart} alt="donutchart" />
                        </div>
                        <Card.Subtitle className="mb-2">
                          We need more information
                        </Card.Subtitle>
                        <Card.Text>
                          When adding clients, be sure to add source information
                        </Card.Text>
                      </Card.Body>
                    </Card>{" "}
                  </Row>
                </Col>
                <Col md={9}>
                  <Card className="border border-ternary rounded mb-4">
                    <Card.Header>
                      <Card.Title>Workload</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={3}>
                          <Row style={{ fontSize: "24px" }}>
                            <b>0</b>
                          </Row>
                          <Row className="mb-2">Tasks overdue</Row>
                          <Row>
                            {" "}
                            <ProgressBar variant="success" now={40} />
                          </Row>
                        </Col>
                        <Col md={3}>
                          <Row style={{ fontSize: "24px" }}>
                            <b>0</b>
                          </Row>
                          <Row className="mb-2">Due this week</Row>
                          <Row>
                            {" "}
                            <ProgressBar variant="info" now={80} />
                          </Row>
                        </Col>
                        <Col md={3}>
                          <Row style={{ fontSize: "24px" }}>
                            <b>0</b>
                          </Row>
                          <Row className="mb-2">Due next week</Row>
                          <Row>
                            {" "}
                            <ProgressBar variant="warning" now={60} />
                          </Row>
                        </Col>
                        <Col md={3}>
                          <Row style={{ fontSize: "24px" }}>
                            <b>0</b>
                          </Row>
                          <Row className="mb-2">Future tasks</Row>
                          <Row>
                            {" "}
                            <ProgressBar variant="success" now={20} />
                          </Row>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          position: "relative",
                          height: "40vh",
                          width: "100%",
                        }}
                      >
                        <Card>
                          <Card.Body className="text-center">
                            <div className=" mb-3">
                              <img src={clipboard} alt="clipboard" />
                            </div>
                            <Card.Subtitle className="mb-2">
                              Once you’ve assigned some tasks you can track them
                              here
                            </Card.Subtitle>
                            <Card.Text>
                              You can add tasks by clicking the ‘+’ button in
                              the top left.
                            </Card.Text>
                          </Card.Body>
                        </Card>{" "}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      {/* <AddEvent show={modalShow} onHide={() => setModalShow(false)} /> */}
    </React.Fragment>
  );
};

export default Dashboard;
