import React from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "./DashboardList.css";

type TopicArea = {
  id: string;
  name: string;
};

type Dashboard = {
  id: string;
  name: string;
  topicArea: TopicArea;
};

type Props = {
  dashboards: Array<Dashboard>;
};

function DashboardList(props: Props) {
  const list = props.dashboards.map(dashboard => (
    <tr key={dashboard.id}>
      <td>{dashboard.topicArea.name}</td>
      <td><Link to={`/dashboard/${dashboard.id}`}>{dashboard.name}</Link></td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>Department</th>
          <th>Service</th>
        </tr>
      </thead>
      <tbody>
        {list}
      </tbody>
    </Table>
  );
}

export default DashboardList;
