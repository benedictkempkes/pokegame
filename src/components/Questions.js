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
        const questionProp = Object.getOwnPropertyNames(this.props.possibleQuestions);
        const questionItem = questionProp.map( (value, index) =>
            <button key={index} value={value} onClick={this.handleClick} >{value}</button>
        );
        return (
            <div>
                <div className="btn-group">
                    {questionItem}
                </div>
            </div>
        );
    }
}