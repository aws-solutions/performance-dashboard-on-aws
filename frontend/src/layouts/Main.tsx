import React, { ReactNode } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./Main.css";

interface LayoutProps {
  children: ReactNode;
}

function MainLayout(props: LayoutProps) {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>badger.aws</Navbar.Brand>
      </Navbar>
      <Container className="Body">{props.children}</Container>
    </>
  );
}

export default MainLayout;
