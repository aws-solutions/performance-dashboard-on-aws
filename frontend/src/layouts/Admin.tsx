import React, { ReactNode } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Sidebar from '../components/Sidebar';
import './Admin.css';

interface LayoutProps {
    children: ReactNode,
}

function AdminLayout(props: LayoutProps) {
  return (
    <div className="Wrapper">
      <Sidebar />
      <div className="Content">
        <Navbar bg="light">
          <Navbar.Brand>&nbsp;</Navbar.Brand>
        </Navbar>
        <div className="Body">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;