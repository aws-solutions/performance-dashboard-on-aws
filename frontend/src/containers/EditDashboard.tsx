import React from "react";
import { PageHeader, Row, Col, Divider, Skeleton, Button, Tag } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useDashboard } from "../hooks";
import AdminLayout from "../layouts/Admin";

function EditDashboard() {
  const history = useHistory();
  const { dashboardId, topicAreaId } = useParams();
  const { dashboard } = useDashboard(topicAreaId, dashboardId);

  const onSubmit = async () => {
    history.push("/admin/dashboards");
  };

  const onCancel = () => {
    history.push("/admin/dashboards");
  };

  const topicarea = dashboard?.topicAreaName;
  const description = dashboard?.description;
  const subtitle = `${topicarea} | ${description}`;

  return (
    <AdminLayout>
      <PageHeader
        ghost={false}
        title={dashboard?.name}
        subTitle={subtitle}
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
