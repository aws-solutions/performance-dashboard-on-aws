import React, { useState, useEffect } from 'react';
import BadgerService from '../../services/badger-service';
import HomepageLayout from '../../layouts/Homepage';
import DashboardList from '../../components/DashboardList';

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
    <HomepageLayout
      title="Performance Dashboard"
      subtitle="Find out how government services are performing and how we define our priorities to serve our citizens."
    >
      <DashboardList dashboards={dashboards} />
    </HomepageLayout>
  );
}

export default Home;
