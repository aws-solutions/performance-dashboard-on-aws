import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";
import './Sidebar.css';

function Sidebar() {
  return (
      <div className="Sidebar">
        <div className="SidebarHeader">
          badger.aws
        </div>
        <ListGroup variant="flush" as="ul">
          <div></div>
          <ListGroup.Item className="ListItem" as="li">
            <Link to="/admin">Topic Areas</Link>
          </ListGroup.Item>
          <ListGroup.Item className="ListItem" as="li">
            <Link to="/admin">Dashboards</Link>
          </ListGroup.Item>
          <ListGroup.Item className="ListItem" as="li">
            <Link to="/admin">Users</Link>
          </ListGroup.Item>
        </ListGroup>
      </div>
  )
}

export default Sidebar;