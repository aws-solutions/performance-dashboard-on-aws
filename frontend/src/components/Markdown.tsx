import React, { useState, useEffect } from 'react';
import { Space, Switch, Input } from "antd";
import './Markdown.css';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

type MarkdownProps = {
    title: string,
    subtitle: string,
};

const Markdown = (props: MarkdownProps) => {
    const [disabled, toggle] = useState(true);
    const [boxHeight, setBoxHeight] = useState(142);
    const [text, setText] = useState('');

    useEffect(() => {
        const height = document.querySelector('textarea')?.clientHeight || 142;
        setBoxHeight(height + 2);
    }, []);

    const textChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    return (
        <div className="markdown">
            <h3>{props.title}</h3>
            <p>{`${props.subtitle} This text area supports limited Markdown.`}</p>
            <Space>
                <Switch onChange={() => toggle(!disabled)}/>
                Preview live text
            </Space>
            {disabled ? 
                <TextArea value={text} onChange={textChange} placeholder="Enter overview text here" rows={6}/> : 
                <div className="markdown-box" style={{ height: boxHeight }}>
                    <ReactMarkdown source={text} />
                </div>}
        </div>
    );
}

export default Markdown;