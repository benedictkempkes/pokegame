import React from 'react';
import {HistoryItem} from './HistoryItem.js';

export class History extends React.Component {
    render(){
        let historyItems;
        if(this.props.history){
            historyItems = this.props.history.map( (value, index) =>
                <HistoryItem key={index} historyItem={value}/>
            );
        }
        return (
            <div className="history">
                <div className="headerHistory">
                    <h3>Answer history</h3>
                </div>
                <ul>
                    {historyItems}
                </ul>
            </div>
        );
    }
}