import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import ChatArea from './components/ChatArea';
import LogIn from './components/LogIn';
import ChatRoom from './components/ChatRoom';

class App extends Component {  
  render() {    
    return (
      <Router>
        <React.Fragment>
          <Route path="/" exact component={ChatRoom} />
          <Switch>
            <Route path="/login" component={LogIn} />      
            <Route path="/:roomId/chat" exact component={ChatArea} />
          </Switch>   
        </React.Fragment>     
      </Router>
    );
  }
}

export default App;
