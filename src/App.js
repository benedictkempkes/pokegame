import React from 'react';
import { Main } from './components/Main';

class App extends React.Component {
  render() {
    return (
        <div className="page">
            <div className="header">
                <h1>Pokemon Card Quiz</h1>
                <h2>Just another boring unofficial pokemon game</h2>
            </div>
            <div className="main">
                <Main />
            </div>
            <div className="footer">
                Developed by Benedict Kempkes <br />
                Xing
            </div>
        </div>
    );
  }
}

export default App;
