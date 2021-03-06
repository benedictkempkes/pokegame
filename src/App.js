import React from 'react';
import { Main } from './components/Main';

class App extends React.Component {
  render() {
    return (
        <div className="page">
            <div className="header">
                <h1>Pokemon Card Quiz</h1>
                <h2>Which Pokemon are you?</h2>
            </div>
            <div className="main">
                <Main />
            </div>
            <div className="footer">
                Developed by Benedict Kempkes <br />
                <a href="https://www.xing.com/profile/Benedict_Kempkes?sc_o=mxb_p">Xing</a>
            </div>
        </div>
    );
  }
}

export default App;
