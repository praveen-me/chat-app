import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import ChatArea from './components/ChatArea';
import LogIn from './components/LogIn';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message : '',
      messages : []
    }
  }
  
  // handleChange = e => {
  //   this.setState({
  //     [e.target.name] : e.target.value
  //   })
  // }
  
  // handleSubmit = e => {
  //   e.preventDefault();
  //   (() => {
  //     socket.emit('message', this.state.message);
  //     document.getElementById('message').value = ''
  //     return false;
  //   })()
  // }

  
  // <div className="App">
  //   <div id="messages"></div>
  //   <form action="" className="message-form" onSubmit={this.handleSubmit}>
  //     <input type="text" name="message" id="message" onChange={this.handleChange}/>
  //     <button type="submit">Submit</button>
  //   </form>
  // </div>
  
  
  render() {    
    return (
      <Router>
        <React.Fragment>
          <Route path="/" exact component={ChatArea} />
          <Switch>
            <Route path="/login" component={LogIn} />      
          </Switch>   
        </React.Fragment>     
      </Router>
    );
  }
}

export default App;
