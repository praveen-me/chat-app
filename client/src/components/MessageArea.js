import React, { Component } from 'react';
import {connect} from 'react-redux';
import socket from '../socketIo';

class MessageArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message : '',
      messages : [],
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
    const {user, toUser} = this.props;
    
  }

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
        <div className="direct-chat-area chat-area">
          <div className="current-user">
            <h3>{toUser.username}</h3>
          </div>
          <div className="messages wrapper">
            {
              messages && messages.map(message => (
                message.author === user.username ? 
                (
                  <div className="message-block block-right">
                    <div className="message-sub_block right-sub_block">
                      <p className="message-text">{message.message}</p>
                      <p className="message-author">{'you'}</p>
                    </div>
                    {
                      !messages.length ? <p>{`${infoMsg} ${user.username}`}</p> : ''
                    }
                  </div>
                ) : 
                (
                  <div className="message-block">
                    <div className="message-sub_block">
                      <p className="message-text">{message.message}</p>
                      <p className="message-author">{message.author}</p>
                    </div>
                  </div>
                )
              ))
            }
          </div>
          <form action="" className="direct-message-form message-form" onSubmit={this.handleSubmit}>
            <input type="text" name="message" id="message" onChange={this.handleChange} className="text-field"/>
            <button type="submit" className="btn">Submit</button>
          </form>
        </div>
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