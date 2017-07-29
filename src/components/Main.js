import React from 'react';
import $ from 'jquery';
import { Questions } from './Questions';
import { Answers } from './Answers';
import { History } from './History';

const possibleQuestions = {
    hp:     'How much HP do you have?',
    number: 'What numer are you?',
    rarity: 'What rarity do you have?',
    type :  'What type are you?',
    weaknesses: 'What is/are your weakness/es?',
    attacks: 'What are your attacks?',
    resisitance: 'What is your resistance?',
    retreatCost: 'What is your retreat cost?',
    evolvesFrom: 'You evolve from?',
    ability: 'What is your ability'
};

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            loading: false,
            currentQuestion: '',
            possibleAnswers: {},
            rightAnswer: {}
        };
        this.chooseQuestion = this.chooseQuestion.bind(this);
    }
    componentDidMount(){
        $.ajax({
            url: 'https://api.pokemontcg.io/v1/cards?pageSize=102&setCode=base1',
            dataType: 'json',
            success: function(data) {
                let random = Math.floor((Math.random()* data.cards.length) +1);
                let rightAnswer = data.cards[random-1];
                let rawData = data.cards;
                this.setState({
                    data: rawData,
                    rightAnswer: rightAnswer
                });
            }.bind(this),
            error: function(xhr, status, err){
                this.setState({
                    error: 'Error'
                });
            }.bind(this)
        });
    }
    
    chooseQuestion(newQuestion) {
        this.createAnswers(newQuestion);
        this.setState({
            currentQuestion: possibleQuestions[newQuestion]
        });
    }
    
    createAnswers(para){
        const answers = this.state.data.map( (object) =>
            object[para]
        );
        console.log(this.state.rightAnswer);
        console.log(answers);
    }
    
    render() {
        let content;
        if(this.state.loading){
           console.log('Webpage is loading');
        }else{
            content = 
                    <div className='row'>
                        <div className='col-md-4'>
                            <h3>Select a question</h3>
                            <Questions possibleQuestions={possibleQuestions} chooseQuestion={this.chooseQuestion}/>
                        </div>
                        <div className='col-md-4'>
                            <h3>Selected question</h3>
                            <Answers currentQuestion={this.state.currentQuestion}/>
                        </div>
                        <div className='col-md-4'>
                            <h3>Answer history</h3>
                            <History />
                        </div>
                    </div>
        }
        return (
            <div>
                {content}
            </div>
        );
    }
}