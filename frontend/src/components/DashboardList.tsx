import React from "react";
import { Link } from "react-router-dom";
import { List } from 'antd';
import "./DashboardList.css";
import { Dashboard } from "../models"

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
            title={<b>{dashboard.topicAreaName}</b>}
            description={<Link to={`/dashboard/${dashboard.topicAreaId}/${dashboard.id}`}>{dashboard.name}</Link>}
          />
        </List.Item>
      )}
    />
  );
}

export default DashboardList;
