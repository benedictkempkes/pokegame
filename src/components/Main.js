import React from 'react';
import $ from 'jquery';
import { Questions } from './Questions';
import { Answers } from './Answers';
import { History } from './History';

var questionValue;

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            loading: false,
            possibleQuestions: {
                hp:     'How much HP do you have?',
                number: 'What numer are you?',
                rarity: 'What rarity do you have?',
                types :  'What type are you?',
                weaknesses: 'What is/are your weakness/es?',
                attacks: 'What are your attacks?',
                evolvesFrom: 'You evolve from?',
                ability: 'What is your ability',
                resistances: 'What is your resistance?'
            },
            currentQuestion: 'Select one attribute from the left',
            possibleAnswers: [],
            rightAnswer: {},
            falseAnswer: [],
            answers: []
        };
        this.chooseQuestion = this.chooseQuestion.bind(this);
        this.handleUserAnswer = this.handleUserAnswer.bind(this);
        this.startGame = this.startGame.bind(this);
    }
    componentDidMount(){
        $.ajax({
            url: 'https://api.pokemontcg.io/v1/cards?pageSize=69&setCode=base1&supertype=Pokémon',
            dataType: 'json',
            success: function(data) {
                let random = Math.floor((Math.random()* data.cards.length) +1);
                let rightAnswer = data.cards[random-1];
                let falseAnswer = [];
                falseAnswer.push(rightAnswer.name);
                while(falseAnswer.length<4){
                    let randomV = Math.floor((Math.random()* data.cards.length) +1);
                    let nextPokemon = data.cards[randomV-1].name;
                    if($.inArray(nextPokemon, falseAnswer) === -1){
                        falseAnswer.push(nextPokemon);
                    }
                    
                }
                let rawData = data.cards;
                this.setState({
                    data: rawData,
                    rightAnswer: rightAnswer,
                    falseAnswer: falseAnswer
                });
            }.bind(this),
            error: function(xhr, status, err){
                this.setState({
                    error: 'Error'
                });
            }.bind(this)
        });
    }
    
    startGame(){
        let random = Math.floor((Math.random()* this.state.data.length) +1);
        let rightAnswer = this.state.data[random-1];
        let falseAnswer = [];
        falseAnswer.push(rightAnswer.name);
        while(falseAnswer.length<4){
            let randomV = Math.floor((Math.random()* this.state.data.length) +1);
            let nextPokemon = this.state.data[randomV-1].name;
            if($.inArray(nextPokemon, falseAnswer) === -1){
                falseAnswer.push(nextPokemon);
            }
        }
        this.setState({
            possibleQuestions: {
                hp:     'How much HP do you have?',
                number: 'What numer are you?',
                rarity: 'What rarity do you have?',
                types :  'What type are you?',
                weaknesses: 'What is/are your weakness/es?',
                attacks: 'What are your attacks?',
                evolvesFrom: 'You evolve from?',
                ability: 'What is your ability?',
                resistances: 'What is your resistance?'
            },
            currentQuestion: 'Select one attribute from the left',
            possibleAnswers: [],
            rightAnswer: rightAnswer,
            falseAnswer: falseAnswer,
            answers: []
        });
    }
    
    chooseQuestion(newQuestion) {
        questionValue = newQuestion;
        if(newQuestion === 'solution'){
            let possibleAnswers = this.state.falseAnswer;
            this.setState({
                currentQuestion: 'Pick your solution',
                possibleAnswers: possibleAnswers
            });
        }else{
            this.createAnswers(newQuestion);
        }
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
        let possibleQuestion = this.state.possibleQuestions;
        this.setState({
            possibleAnswers: answers,
            currentQuestion: possibleQuestion[para]
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
        if(questionValue === 'solution'){
            let finalAnswer;
            let finalImg = this.state.rightAnswer.imageUrlHiRes;
            if(val1 === this.state.rightAnswer.name){
                finalAnswer = 'Congratulations! You won! The right answer is: ' + this.state.rightAnswer.name + '.';
            }else{
                finalAnswer = 'Sorry! You lost! The right answer is: ' + this.state.rightAnswer.name + '.';
            }
            
            this.setState({
                possibleQuestions: {
                    img: finalImg
                },
                possibleAnswers: [],
                currentQuestion: finalAnswer
            });
        }else{
            this.handlePreAnswer(val1, val2);
        }
    }
    handlePreAnswer(val1, val2){
        let question = this.state.possibleQuestions[questionValue];
        let newPossibleQuestions = this.state.possibleQuestions;
        delete newPossibleQuestions[questionValue];
        let answer;
        if(val2 !== null){
           answer = val1 + "-" + val2;
        }else{
           answer = val1;
        }
        let solution = '';
        if(val2 !== null){
            solution = this.checkNumberAnswer(val1, val2);
        }else{
            solution = this.checkOtherAnswer(val1);
        }
        let newAnswer = {
                question: question,
                answer: answer,
                solution: solution
            };
        let newAnswers = this.state.answers;
        newAnswers.push(newAnswer);
        this.setState({
            answers: newAnswers,
            possibleQuestions: newPossibleQuestions,
            currentQuestion: 'Select one attribute from the left',
            possibleAnswers: []
        });
    }
    checkNumberAnswer(val1, val2){
        if(Number(val1) <= this.state.rightAnswer[questionValue] && Number(val2) >= this.state.rightAnswer[questionValue]){
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
                    <div className='mainContent'>
                        <div className="container-fluid">
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='viewQuestion'>
                                        <Questions possibleQuestions={this.state.possibleQuestions} chooseQuestion={this.chooseQuestion}/>
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='viewAnswer'>
                                        <Answers currentQuestion={this.state.currentQuestion} possibleAnswers={this.state.possibleAnswers} getUserAnswer={this.handleUserAnswer} />
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='viewHistory'>
                                        <History history={this.state.answers}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="divForNewGame">
                            <button className="impBtn" onClick={this.startGame}>New Game</button>
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