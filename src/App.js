import React from 'react';
import { Main } from './components/Main';

class App extends React.Component {
  render() {
    return (
        <div>
            <div className="header">
                <h1>Pokemon Card Quiz</h1>
                <h2>Just another unofficial Pokemon game</h2>
            </div>
            <div className="main">
                <Main />
            </div>
            <div className="footer">
                Impressum
            </div>
        </div>
    );
  }
}

export default App;
