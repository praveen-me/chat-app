import React, { Component, lazy, Suspense } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import './scss/app.scss';
import Header from './components/Header';
const LogIn = lazy(() => import(/* webpackChunkName: 'Login' */'./components/LogIn'));
const ChatArea = lazy(() => import(/* webpackChunkName: 'ChatArea' */'./components/ChatArea'));
const ChatRoom = lazy(() => import(/* webpackChunkName: 'ChatRoom' */'./components/ChatRoom'));
const SignUp = lazy(() => import(/* webpackChunkName: 'SignUp' */'./components/SignUp'));
const DirectMessage = lazy(() => import(/* webpackChunkName: 'DirectMessage' */'./components/DirectMessage'));

class App extends Component {  
  render() {    
    return (
      <Router>
        <React.Fragment>
          <Header/>
          <Switch>
            <Suspense fallback="Loading...">
              <Route path="/" exact component={ChatRoom} />
              <Route path="/login" component={LogIn} />
              <Route path="/:roomId/chat" exact component={ChatArea} />
              <Route path="/signup" component={SignUp} />
              <Route path='/direct' component={DirectMessage}/>
            </Suspense>        
          </Switch>   
        </React.Fragment>     
      </Router>
    );
  }
}

export default App;
