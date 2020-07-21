import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import './Admin.css';

const { Header, Content } = Layout;

interface LayoutProps {
    children: ReactNode,
}

function AdminLayout(props: LayoutProps) {
  return (
    <Layout className="AdminLayout">
      <Sidebar />
      <Layout>
        <Header className="Topbar" />
        <Content className="AdminContent">
          <div className="ContentBox">
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;