import React from 'react';

export class Answers extends React.Component {
    render(){
        const possibleAnswers = this.props.possibleAnswers;
        const answerItem = possibleAnswers.map( (value, index) =>
            <button key={index} value={value} onClick={this.handleClick} >{value}</button>
        );
        return (
            <div>
                <h1>{this.props.currentQuestion}</h1>
                    {answerItem}
            </div>
        );
    }
}