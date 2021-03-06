import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import chat from '../store/actions/chatActions';
import socket from '../socketIo';

class ChatArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message : '',
      messages : [],
      isLoading : true,
      infoMsg : '',
      currentChatRoom : ''
    }
  }

  componentDidMount() {
    console.log(socket)
    const {roomId} = this.props;
    this.props.dispatch(chat.getAllMessagesForChatRoom(roomId, (data) => {
      if (data.msg) {
        this.setState({
          infoMsg: data.msg,
          isLoading: false  
        })
      } else {
        this.setState({
          isLoading : false,
          currentChatRoom : data.room.name,
          messages : [...this.state.messages, ...data.room.messages]
        })
      }
    }))  
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const {message} = this.state;
    const {user, roomId} = this.props;
    if (navigator.onLine) { 
      socket.emit('message', {
        message,
        author : user.username, 
        currentChatRoomId : roomId
      })
      document.getElementById('message').value = '';
    } else {
      this.setState({
        infoMsg : 'Internet not available. Please connected to secure connection.'
      })
    }
  }

  getMessage = (()  =>{
    socket.on('chat', (msg) => {
      console.log(msg)
      this.setState({
        infoMsg : '',
        messages : [...this.state.messages, msg]
      })
    })
  })()
  
  render() { 
    const {user} = this.props;
    const {messages, isLoading, currentChatRoom, infoMsg} = this.state;
    if(!user.username) return <Redirect to="/login"/>
    
    return (
      isLoading ? 
      <p>Loading...</p> : (
        <div className="chat-area">
          {
            infoMsg ? <p>{`${infoMsg} ${user.username}`}</p> : 
            (
              <div>
                <h2 className="chatroom-name">{currentChatRoom}</h2>
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
              </div>
            )
          }
          <form action="" className="message-form" onSubmit={this.handleSubmit}>
            <input type="text" name="message" id="message" onChange={this.handleChange} className="text-field"/>
            <button type="submit" className="btn">Submit</button>
          </form>
        </div>
      )
      
    );
  }
}

function mapStateToProps(state, ownProps) {
  console.log(ownProps)
  return {
    user : state.user,
    roomId : ownProps.match.params.roomId
  }
} 

export default connect(mapStateToProps)(ChatArea);