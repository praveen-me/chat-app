import React, { Component } from 'react';
import {connect} from 'react-redux';
import socket from '../socketIo';

class MessageArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message : '',
      messagesData : {},
      isLoading : false,
      infoMsg : ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  componentDidMount() {
    console.log('Hello World')
  }
  

  setMessages = (() => {
    this.setState({
      messagesData : this.props.messages
    })
  })()

  handleSubmit = e => {
    e.preventDefault();
    const {message} = this.state;
    const {user, toUser} = this.props;
    if (navigator.onLine) {
      socket.emit('direct-message', {
        message,
        user1: user._id,
        user2: toUser.userId,
        author: user.username,
        to: toUser.username
      })
      document.getElementById('message').value = '';
    } else {
      this.setState({
        infoMsg : 'Internet not available. Please connected to secure connection.'
      })
    }
    console.log(socket);
  }

  getMessage = (()  =>{
    socket.on('directChat', (msg) => {
      console.log(msg)
      const {user, toUser} = this.props;
      if(toUser.username === msg.author || msg.to === toUser.username) {
        this.setState({
          infoMsg : '',
          messages : [...this.state.messages, msg]
        })
      }
    })
  })()
  
  render() {
    const {isLoading, messages, infoMsg} = this.state;
    const {toUser, user} = this.props;
    
    return (
      isLoading ? 
      <p>Loading...</p> : (
        
      )
      
    );
  }
};

function mapStateToProps(state) {
  return {
    user : state.user,
  }
}

export default connect(mapStateToProps)(MessageArea);