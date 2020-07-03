import React, { ReactNode } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './index.css';

interface LayoutProps {
    children: ReactNode,
    title: string,
}

function MainLayout(props: LayoutProps) {
  return (
    <>
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand>badger.aws</Navbar.Brand>
    </Navbar>
    <Container className="Header">
        <h1>{props.title}</h1>
    </Container>
    <Container className="Body">
        {props.children}
    </Container>
    <div className="Footer">
        Copyright Amazon Web Services 2020
    </div>
    </>
  );
}

export default MainLayout;