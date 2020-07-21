import React from "react";
import { Link } from "react-router-dom";
import { List } from 'antd';
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
  return (
    <List
      dataSource={props.dashboards}
      renderItem={(dashboard: Dashboard) => (
        <List.Item>
          <List.Item.Meta
            title={<b>{dashboard.topicArea.name}</b>}
            description={<Link to={`/dashboard/${dashboard.id}`}>{dashboard.name}</Link>}
          />
        </List.Item>
      )}
    />
  );
}

export default DashboardList;
