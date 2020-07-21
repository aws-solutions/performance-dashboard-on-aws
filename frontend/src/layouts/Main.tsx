import React, { ReactNode } from "react";
import { Layout, Row, Col } from 'antd';
import "./Main.css";

const { Header, Content } = Layout;

interface LayoutProps {
  children: ReactNode;
}

function MainLayout(props: LayoutProps) {
  return (
    <Layout className="MainLayout">
      <Header>
        <div className="Logo">badger.aws</div>
      </Header>
      <Content className="MainContent">
        <Row justify="center">
          <Col span={16}>
            {props.children}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default MainLayout;
