import React from 'react';
import {SliderView} from './SliderView';
import PropTypes from 'prop-types';

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
    shuffle(a){
        for(let i = a.length; i; i-- ){
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
    render(){
        var answerView;
        const possibleAnswers = this.props.possibleAnswers;
        if(typeof this.props.possibleAnswers[0] === 'number'){
            answerView = <SliderView getNumbers={this.handleNumbers} minValue={this.props.possibleAnswers[0]} maxValue={this.props.possibleAnswers[1]}/>
        }else{
            this.shuffle(possibleAnswers);
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

Answers.propTypes = {
    currentQuestion: PropTypes.string,
    possibleAnswers: PropTypes.array,
    getUserAnswer: PropTypes.func
}