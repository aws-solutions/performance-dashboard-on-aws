import React from 'react';
import { Layout, Menu } from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  AreaChartOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import './Sidebar.css';

const { Sider } = Layout;

function Sidebar() {
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="SidebarHeader">badger.aws</div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        <Menu.Item key="1" icon={<DatabaseOutlined />}>
          <Link to="/admin">Topic Areas</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<AreaChartOutlined />}>
          <Link to="/admin">Dashboards</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          <Link to="/admin">Roles & Permissions</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          <Link to="/admin">Settings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Sidebar;