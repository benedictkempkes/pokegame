import React from 'react';

export class HistoryItem extends React.Component {
    render(){
        let symbol;
        if(this.props.historyItem.solution === 'True'){
            symbol = <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
        }else{
            symbol = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
        }
        return (
            <li>
                {this.props.historyItem.question} {this.props.historyItem.answer} {symbol}
            </li>
        );
    }
}