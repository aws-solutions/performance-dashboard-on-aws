import React from "react";
import AdminLayout from "../layouts/Admin";
import { PageHeader, Button, Skeleton, Divider } from "antd";

function DashboardListing() {
  return (
    <AdminLayout>
      <PageHeader
        ghost={false}
        title="Dashboards"
        extra={[
          <Button key="1" type="primary">
            Create dashboard
          </Button>,
        ]}
      />
      <Skeleton />
      <Divider />
      <Skeleton />
    </AdminLayout>
  );
}

export default DashboardListing;
