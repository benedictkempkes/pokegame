import React from 'react';

export class HistoryItem extends React.Component {
    render(){
        return (
            <li>
                <ul>
                    <li>{this.props.historyItem.question}</li>
                    <li>{this.props.historyItem.answer}</li>
                    <li>{this.props.historyItem.solution}</li>
                </ul>
            </li>
        );
    }
}