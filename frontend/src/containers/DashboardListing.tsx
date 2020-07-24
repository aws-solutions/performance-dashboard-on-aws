import React from "react";
import { useHistory } from "react-router-dom";
import AdminLayout from "../layouts/Admin";
import { PageHeader, Button, Skeleton, Divider } from "antd";

function DashboardListing() {
  const history = useHistory();

  return (
    <AdminLayout>
      <PageHeader
        ghost={false}
        title="Dashboards"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => history.push("/admin/dashboard/create")}
          >
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
