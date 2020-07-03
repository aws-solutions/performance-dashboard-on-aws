import React, { ReactNode } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Jumbotron from 'react-bootstrap/Jumbotron';
import './index.css';

interface LayoutProps {
    children: ReactNode,
    title: string,
    subtitle?: string,
}

function HomeLayout(props: LayoutProps) {
  return (
    <>
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand>badger.aws</Navbar.Brand>
    </Navbar>
    <Jumbotron fluid>
        <Container>
            <h1>{props.title}</h1>
            <p>{props.subtitle}</p>
        </Container>
    </Jumbotron>
    <Container className="Body">
        {props.children}
    </Container>
    <div className="Footer">
        Copyright Amazon Web Services 2020
    </div>
    </>
  );
}

export default HomeLayout;