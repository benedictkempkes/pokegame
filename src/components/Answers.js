import React from 'react';
import {SliderView} from './SliderView';

export class Answers extends React.Component {
    constructor(props){
        super(props);
        this.handleNumbers = this.handleNumbers.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleNumbers(down, up){
        this.props.getUserAnswer(down, up);
    }
    handleClick(e){
        const target = e.target.value;
        this.props.getUserAnswer(target, null);
    }
    render(){
        var answerView;
        const possibleAnswers = this.props.possibleAnswers;
        if(typeof this.props.possibleAnswers[0] === 'number'){
            answerView = <SliderView getNumbers={this.handleNumbers} />
        }else{
            answerView = possibleAnswers.map( (value, index) =>
                <button key={index} value={value} onClick={this.handleClick} >{value}</button>
            );
        }
        return (
            <div className="answers">
                <div className="headerAnswers">
                    <h3>{this.props.currentQuestion}</h3>
                </div>
                {answerView}
            </div>
        );
    }
}