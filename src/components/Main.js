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

var questionValue;

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            loading: false,
            currentQuestion: '',
            possibleAnswers: [],
            rightAnswer: {},
            answers: [
            ]
        };
        this.chooseQuestion = this.chooseQuestion.bind(this);
        this.handleUserAnswer = this.handleUserAnswer.bind(this);
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
                console.log(this.state.rightAnswer);
            }.bind(this),
            error: function(xhr, status, err){
                this.setState({
                    error: 'Error'
                });
            }.bind(this)
        });
    }
    
    chooseQuestion(newQuestion) {
        questionValue = newQuestion;
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
    handleUserAnswer(val1, val2){
        let solution = '';
        if(val2 !== null){
            solution = this.checkNumberAnswer(val1, val2);
        }else{
            solution = this.checkOtherAnswer(val1);
        }
        let newAnswer = {
                question: possibleQuestions[questionValue],
                answer: val1,
                solution: solution
            };
        let newAnswers = this.state.answers;
        newAnswers.push(newAnswer);
        this.setState({
            answers: newAnswers
        });
        
        
    }
    checkNumberAnswer(val1, val2){
        if(val1 <= this.state.rightAnswer[questionValue] && val2 >= this.state.rightAnswer[questionValue]){
            return 'True';
        }else{
            return 'False';
        }
    }
    checkOtherAnswer(val1){
        if(!this.state.rightAnswer[questionValue]){
            //Undefined as answer
            if(val1 === 'None'){
                return 'True';
            }else{
                return 'False';
            }
        }else{
            switch(questionValue){
                case 'rarity':
                    return this.checkString(val1);
                case 'types':
                    return this.CheckArray(val1);
                case 'weaknesses':
                    return this.CheckObject(val1, 'type');
                case 'attacks':
                    return this.CheckObject(val1, 'name');
                case 'evolvesFrom':
                    return this.checkString(val1);
                case 'ability':
                    if(val1 === this.state.rightAnswer[questionValue].name){
                        return 'True';
                    }else{
                        return 'False';
                    }
                case 'resistances':
                    return this.CheckObject(val1, 'type');
                default:
                    console.log('Something went wrong');
            }
        }
    }
    checkString(val1){
        if(val1 === this.state.rightAnswer[questionValue]){
            return 'True';
        }else{
            return 'False';
        }
    }
    CheckArray(val1){
        if(val1 === this.state.rightAnswer[questionValue][0]){
            return 'True';
        }else{
            return 'False';
        }
    }
    CheckObject(val1, attributeName){
        if(this.state.rightAnswer[questionValue].length > 1){
            let correctAnswerAsArray = [];
            for(var i = 0; i < this.state.rightAnswer[questionValue].length; i++){
                correctAnswerAsArray.push(this.state.rightAnswer[questionValue][i][attributeName]);
            }
            if(val1 === correctAnswerAsArray.toString()){
                return 'True';
            }else{
                return 'False';
            }
        }else{
            if(val1 === this.state.rightAnswer[questionValue][0][attributeName]){
                return 'True';
            }else{
                return 'False';
            }
        }

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
                            <Answers currentQuestion={this.state.currentQuestion} possibleAnswers={this.state.possibleAnswers} getUserAnswer={this.handleUserAnswer} />
                        </div>
                        <div className='col-md-4'>
                            <h3>Answer history</h3>
                            <History history={this.state.answers}/>
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