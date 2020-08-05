import React from "react";
import { PageHeader, Row, Col } from "antd";
import { useHistory } from "react-router-dom";
import AdminLayout from "../layouts/Admin";
import CreateDashForm from "../components/CreateDashForm";
import BadgerService from "../services/BadgerService";

function CreateDashboard() {
  const history = useHistory();

  const onSubmit = async (dashboard: any) => {
    const newDashboard = await BadgerService.createDashboard(
      dashboard.name,
      dashboard.topicAreaId
    );

    const dashboardId = newDashboard.id;
    const topicAreaId = newDashboard.topicAreaId;
    history.push(`/admin/dashboard/edit/${topicAreaId}/${dashboardId}`);
  };

  const onCancel = () => {
    history.push("/admin/dashboards");
  };

  return (
    <AdminLayout>
      <PageHeader ghost={false} title="Create Dashboard" />
      <Row>
        <Col xs={24} md={12}>
          <CreateDashForm onSubmit={onSubmit} onCancel={onCancel} />
        </Col>
      </Row>
    </AdminLayout>
  );
}

export default CreateDashboard;
