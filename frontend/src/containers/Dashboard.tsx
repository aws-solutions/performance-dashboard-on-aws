import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend, ResponsiveContainer
} from 'recharts';
import { useDashboard } from "../hooks";
import PageHeader from '../components/PageHeader';
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

function Dashboard() {
  const { dashboardId } = useParams();
  const { dashboard } = useDashboard(dashboardId);

  if(dashboard === null) {
    return (<span>Loading</span>);
  }

  return (
    <MainLayout>
      <PageHeader>
        <PageHeader.Title>{dashboard?.name}</PageHeader.Title>
      </PageHeader>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Bananas">
            $1,500
          </Card>
        </Col>
        <Col span={8}>
          <Card title="691m">
            This is some important metric
          </Card>
        </Col>
        <Col span={8}>
          <Card title="691m">
            This is some important metric
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 15 }}>
        <Col span={8}>
          <Card title="691m">
            This is some important metric
          </Card>
        </Col>
        <Col span={8}>
          <Card title="691m">
            This is some important metric
          </Card>
        </Col>
        <Col span={8}>
         <Card title="691m">
            This is some important metric
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 60 }}>
        <Col span={24}>
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
      <Row style={{ marginTop: 60 }} gutter={16}>
        <Col span={24}>
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
    </MainLayout>
  );
}

export default Dashboard;
