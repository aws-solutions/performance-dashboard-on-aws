import React, { ReactNode } from 'react';
import './PageHeader.css';

interface Props {
    children: ReactNode,
}

function Subtitle(props: Props) {
    return (
        <p>{props.children}</p>
    );
}

function Title(props: Props) {
    return (
        <h1>{props.children}</h1>
    );
}

function PageHeader(props: Props) {
    return (
        <div className="Header">
            {props.children}
        </div>
    )
}

PageHeader.Title = Title;
PageHeader.Subtitle = Subtitle;

export default PageHeader;