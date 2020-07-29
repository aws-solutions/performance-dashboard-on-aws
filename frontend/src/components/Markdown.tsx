import React from 'react';
import { Space, Switch, Input } from "antd";
import './Markdown.css';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

type MarkdownProps = {
    title: string,
    subtitle: string,
};

type MarkdownState = {
    disabled: boolean,
    boxHeight: number,
    text: string,
};

class Markdown extends React.Component<MarkdownProps, MarkdownState> {
    constructor(props: MarkdownProps) {
        super(props);
        this.state = {disabled: true, boxHeight: 96, text: ''};
    }

    componentDidMount() {
        const height = document.querySelector('textarea')?.clientHeight || 142;
        this.setState({ boxHeight: height + 2 });
    };

    textChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({text: event.target.value});
    };

    toggle = () => {
        this.setState((state) => ({disabled: !state.disabled}));
    };

    render() {
        return (
            <div className="markdown">
                <h3>{this.props.title}</h3>
                <p>{`${this.props.subtitle} This text area supports limited Markdown.`}</p>
                <Space>
                    <Switch onChange={this.toggle}/>
                    Preview live text
                </Space>
                {this.state.disabled ? 
                    <TextArea value={this.state.text} onChange={this.textChange} placeholder="Enter overview text here" rows={6}/> : 
                    <div className="markdown-box" style={{ height: this.state.boxHeight }}>
                        <ReactMarkdown source={this.state.text} />
                    </div>}
            </div>
        )
    }
}

export default Markdown;