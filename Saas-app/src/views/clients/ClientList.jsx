import React, { useState, useEffect } from "react";
import { Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import Loading from "../../components/loader/Loading";

import ClientTable from "../../components/clients/tables/ClientTable";
import axios from "axios";
import AddClient from "../../components/clients/modals/AddClient";
// import { sampleData } from 'assets/data/data';
// Sample data (same as before)

const ClientList = () => {
  // Grouped columns

  const [modalShow, setModalShow] = React.useState(false);
  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/clients/all-clients/${localStorage.getItem("id")}`
        );
        setClientList(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      }
    };
    fetchContacts();
  }, [modalShow]);

  return (
    <React.Fragment>
      {loading && <Loading />}

      <Row>
        <Col>
          <Row>
            <Col md={2}>
              <h5>
                <b>Client List</b>
              </h5>
            </Col>
            <Col md={8}></Col>
            <Col md={2}>
              <Button onClick={() => setModalShow(true)}>Add Client</Button>
            </Col>
          </Row>
          <hr />
          <Tabs variant="underline" defaultActiveKey="active-clients">
            <Tab eventKey="active-clients" title="Active Clients">
              <ClientTable sampleData={clientList} />
            </Tab>
            <Tab eventKey="business" title="Business">
              <ClientTable sampleData={clientList} />
            </Tab>
            <Tab eventKey="individual" title="Individual">
              <ClientTable sampleData={clientList} />
            </Tab>
          </Tabs>
          {/* Modal for Column Management */}

          <AddClient show={modalShow} onHide={() => setModalShow(false)} />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ClientList;
