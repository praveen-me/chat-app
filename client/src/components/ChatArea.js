import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

class ChatArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message : '',
      messages : []
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const {message} = this.state;
    const {username} = this.props;
    socket.emit('message', {
      message,
      author : username
    })
    document.getElementById('message').value = '';
  }

  getMessage = (()  =>{
    socket.on('chat', (msg) => {
      console.log(msg)
      this.setState({
        messages : [...this.state.messages, msg]
      })
    })
  })()
  
  render() { 
    const {username} = this.props;
    if(!username) return <Redirect to="/login"/>
    
    return (
      <div>
        <div className="messages"></div>
        <form action="" className="message-form" onSubmit={this.handleSubmit}>
          <input type="text" name="message" id="message" onChange={this.handleChange}/>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username : state.username
  }
} 

export default connect(mapStateToProps)(ChatArea);