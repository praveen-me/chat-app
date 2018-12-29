import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import ChatArea from './components/ChatArea';
import LogIn from './components/LogIn';
import ChatRoom from './components/ChatRoom';

import './scss/app.scss';
import Header from './components/Header';

class App extends Component {  
  render() {    
    return (
      <Router>
        <React.Fragment>
          <Header/>
          <Switch>
            <Route path="/" exact component={ChatRoom} />
            <Route path="/login" component={LogIn} />      
            <Route path="/:roomId/chat" exact component={ChatArea} />
          </Switch>   
        </React.Fragment>     
      </Router>
    );
  }
}

export default App;
