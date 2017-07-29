import React from 'react';

export class Answers extends React.Component {
    render(){
        return (
            <div>
                <h1>{this.props.currentQuestion}</h1>
            </div>
        );
    }
}