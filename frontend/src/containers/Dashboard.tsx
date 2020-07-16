import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import {
  BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend, ResponsiveContainer
} from 'recharts';

import PageHeader from '../components/PageHeader';
import BadgerService from '../services/BadgerService';
import MainLayout from '../layouts/Main';

const data = [
  { name: 'Jan', suv: 1.54, sedan: 3.3 },
  { name: 'Feb', suv: 2.05, sedan: 3.54 },
  { name: 'Mar', suv: 0.7, sedan: 2.58 },
  { name: 'Apr', suv: 2.25, sedan: 1.59 },
  { name: 'May', suv: 3.59, sedan: 3.92 },
  { name: 'Jun', suv: 3.63, sedan: 4.64 },
  { name: 'Jul', suv: 4.91, sedan: 4.02 },
  { name: 'Aug', suv: 2.66, sedan: 1.54 },
  { name: 'Sep', suv: 1.50, sedan: 1.86 },
  { name: 'Oct', suv: 4.19, sedan: 2.62 },
  { name: 'Nov', suv: 7.22, sedan: 3.42 },
  { name: 'Dec', suv: 2.58, sedan: 3.35 },
];

type dashboard = {
  id: string,
  name: string,
};

function Dashboard() {
  const [dashboard, setDashboard] = useState<dashboard | null>(null);
  const { dashboardId } = useParams();

  useEffect(() => {
    async function fetchDashboard() {
      const data = await BadgerService.fetchDashboardById(dashboardId);
      setDashboard(data);
    }
    fetchDashboard();
  }, [dashboardId]);

  if(dashboard === null) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <MainLayout>
      <PageHeader>
        <PageHeader.Title>{dashboard.name}</PageHeader.Title>
      </PageHeader>
      <Row style={{ marginBottom: 20 }}>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title><h2>691m</h2></Card.Title>
              This is some important metric
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title><h2>20m</h2></Card.Title>
              This is some important metric
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title><h2>100k</h2></Card.Title>
              Very relevant data
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title><h2>$1,500</h2></Card.Title>
              Bananas
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title><h2>800</h2></Card.Title>
              This is some important metric
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title><h2>1.1M</h2></Card.Title>
              This is some important metric
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 60 }}>
        <Col>
          <h3>Renewals by Vehicle Type</h3>
          <hr />
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="sedan" fill="#8884d8" />
              <Bar dataKey="suv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
      <Row style={{ marginTop: 60 }}>
        <Col>
          <h3>Registrations by Month</h3>
          <hr />
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Line dataKey="sedan" fill="#8884d8" />
              <Line dataKey="suv" fill="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Col>
      </Row>
      <Row style={{ marginTop: 60, marginBottom: 50 }}>
        <Col>
          <h3>Cost per Transaction</h3>
          <hr />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Cost per unit</th>
                <th>Total transactions</th>
                <th>Total cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vehicle Registration</td>
                <td>$25</td>
                <td>1,756</td>
                <td>$43,900</td>
              </tr>
              <tr>
              <td>Renewals</td>
                <td>$30</td>
                <td>2,321</td>
                <td>$83,900</td>
              </tr>
              <tr>
              <td>Citations</td>
                <td>$81</td>
                <td>5,100</td>
                <td>$123,392</td>
              </tr>
              <tr>
              <td>Something Else</td>
                <td>$12</td>
                <td>678</td>
                <td>$6,780</td>
              </tr>
              <tr>
              <td>Banana</td>
                <td>$16</td>
                <td>342</td>
                <td>$5,472</td>
              </tr>
            </tbody>
          </Table>
          <br />
        </Col>
      </Row>
    </MainLayout>
  );
}

export default Dashboard;
