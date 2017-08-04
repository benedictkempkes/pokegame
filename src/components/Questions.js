import React from 'react';

export class Questions extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        const target = e.target.value;
        this.props.chooseQuestion(target);
    }
    render(){
        let content;
        let questionItem;
        if(typeof this.props.possibleQuestions === 'string'){
            content = <img width="100%" src={this.props.possibleQuestions} alt="Pokemon Card"/>
        }else{
            const questionProp = Object.getOwnPropertyNames(this.props.possibleQuestions);
            questionItem = questionProp.map( (value, index) =>
                <button key={index} value={value} onClick={this.handleClick} >{value}</button>
            );
            content = 
                <div>
                    <div className="headerQuestions">
                        <button className="impBtn" onClick={this.handleClick} value='solution'>I want to solve</button>
                    </div>
                    <br />
                    <div className="btn-group">
                    {questionItem}
                    </div>
                </div>
        }
        return (
            <div className="questions">
                {content}
            </div>
        );
    }
}