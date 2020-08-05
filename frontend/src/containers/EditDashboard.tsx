import React from "react";
import { PageHeader, Row, Col, Divider, Skeleton, Button, Tag } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useDashboard } from "../hooks";
import AdminLayout from "../layouts/Admin";

function EditDashboard() {
  const history = useHistory();
  const { dashboardId } = useParams();
  const { dashboard } = useDashboard(dashboardId);

  const onSubmit = async () => {
    history.push("/admin/dashboards");
  };

  const onCancel = () => {
    history.push("/admin/dashboards");
  };

  const topicarea = dashboard?.topicAreaName;

  return (
    <AdminLayout>
      <PageHeader
        ghost={false}
        title={dashboard?.name}
        subTitle={topicarea}
        extra={<Tag>Draft</Tag>}
      />
      <Row>
        <Col span={24}>
          <Divider orientation="left">Overview</Divider>
          <Skeleton />
          <Divider orientation="left">Dashboard Content</Divider>
          <Skeleton />
          <Divider />
          <Button type="primary" onClick={() => onSubmit()}>Save & Close</Button>
          <Button onClick={() => onCancel()}>Cancel</Button>
        </Col>
      </Row>
    </AdminLayout>
  );
}

export default EditDashboard;
