import React, { useState, useEffect } from 'react';
import BadgerService from '../services/BadgerService';
import MainLayout from '../layouts/Main';
import PageHeader from '../components/PageHeader';
import DashboardList from '../components/DashboardList';

function Home() {
  const [dashboards, setDashboards] = useState([]);
  useEffect(() => {
    fetchDashboards();
  }, []);

  async function fetchDashboards() {
    const data = await BadgerService.fetchDashboards();
    setDashboards(data);
  }

  return (
    <MainLayout>
      <PageHeader>
        <PageHeader.Title>Performance Dashboard</PageHeader.Title>
        <PageHeader.Subtitle>Find performance data of government services</PageHeader.Subtitle>
      </PageHeader>
      <DashboardList dashboards={dashboards} />
    </MainLayout>
  );
}

export default Home;
