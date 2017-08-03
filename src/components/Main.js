import React from 'react';
import $ from 'jquery';
import { Questions } from './Questions';
import { Answers } from './Answers';
import { History } from './History';

const possibleQuestions = {
    hp:     'How much HP do you have?',
    number: 'What numer are you?',
    rarity: 'What rarity do you have?',
    types :  'What type are you?',
    weaknesses: 'What is/are your weakness/es?',
    attacks: 'What are your attacks?',
    evolvesFrom: 'You evolve from?',
    ability: 'What is your ability',
    resistances: 'What is your resistance?'
};

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            loading: false,
            currentQuestion: '',
            possibleAnswers: [],
            rightAnswer: {}
        };
        this.chooseQuestion = this.chooseQuestion.bind(this);
    }
    componentDidMount(){
        $.ajax({
            url: 'https://api.pokemontcg.io/v1/cards?pageSize=69&setCode=base1&supertype=Pokémon',
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
        //get all possible Answers
        const answerItem = this.state.data.map( (object) =>
            object[para]
        );
        const answerItemUniquePre = [...new Set(answerItem)];
        let answerItemUnique = [];
        for(var k = 0; k < answerItemUniquePre.length; k++){
            if(answerItemUniquePre[k]){
                answerItemUnique.push(answerItemUniquePre[k]);
            }
        }
        let answerItemUniquePost = [];
        let answers = [];
        switch(para){
            case 'hp':
                answers = [0, 120];
                break;
            case 'number':
                answers = [0, 69];
                break;
            case 'ability':
                for(let j = 0; j < answerItemUnique.length; j++){
                    answerItemUniquePost.push(answerItemUnique[j].name);
                }
                answers = this.getAnswersFromStrings(para, answerItemUniquePost, '3');
                break;
            case 'evolvesFrom':
                answerItemUnique.push('None');
                answers = this.getAnswersFromStrings(para, answerItemUnique, '2');
                break;
            case 'types':
                for(let j = 0; j < answerItemUnique.length; j++){
                    answerItemUniquePost.push(answerItemUnique[j][0]);
                }
                answers = this.getAnswersFromStrings(para, answerItemUniquePost, '1');
                break;
            case 'rarity':
                for(let i = 0; i < answerItemUnique.length; i++){
                    answers.push(answerItemUnique[i]);
                }
                break;
            case 'weaknesses':
                answers = this.getAnswersFromObjects(para, 'type', answerItemUnique);
                break;
            case 'attacks':
                answers= this.getAnswersFromObjects(para, 'name', answerItemUnique);
                break;
            case 'resistances':
                answerItemUnique.push([{type: 'None', value: '0'}]);
                answers= this.getAnswersFromObjects(para, 'type', answerItemUnique);
                break;
            default:
                console.log('wrong');
        }
        this.setState({
            possibleAnswers: answers
        });
    }
    
    componentDidUpdate() {
        console.log(this.state.possibleAnswers);
    }
    
    getAnswersFromStrings(para, answerItemUnique, formatRightAnswer){
        let result = [];
        if(this.state.rightAnswer[para] == null){
            result.push('None');
        }else{
            if(formatRightAnswer === '1'){
                result.push(this.state.rightAnswer[para][0]);
            }else if(formatRightAnswer === '3'){
                result.push(this.state.rightAnswer[para].name);
            }else{
                result.push(this.state.rightAnswer[para]);
            }
            
        }
        while(result.length < 4){
            const randomV = Math.floor((Math.random() * answerItemUnique.length) + 1) - 1;
            if($.inArray(answerItemUnique[randomV], result) === -1){
                result.push(answerItemUnique[randomV]);
            }
        }
        return result;
    }
    
    getAnswersFromObjects(para, attribut, answerItemUnique){
        let result = [];
        let pseudoAnswer = [];
        let objectToStrings = [];
        if(this.state.rightAnswer[para] == null){
            objectToStrings.push('None');
        }else{
            for(var i = 0; i < this.state.rightAnswer[para].length; i++){
                objectToStrings.push(this.state.rightAnswer[para][i][attribut]);
            }
        }
        pseudoAnswer.push(objectToStrings[0]);
        result.push(objectToStrings);
        while(result.length < 4){
            const randomV = Math.floor((Math.random() * answerItemUnique.length) + 1) - 1;
            if($.inArray(answerItemUnique[randomV][0][attribut], pseudoAnswer) === -1){
                let objectToStrings = []
                for(var j = 0; j < answerItemUnique[randomV].length; j++){
                    objectToStrings.push(answerItemUnique[randomV][j][attribut]);
                }
                pseudoAnswer.push(objectToStrings[0]);
                result.push(objectToStrings);
            }
        }
        return result;
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
                            <Answers currentQuestion={this.state.currentQuestion} possibleAnswers={this.state.possibleAnswers}/>
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