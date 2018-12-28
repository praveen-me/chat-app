import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import io from 'socket.io-client';
import chat from '../store/actions/chatActions';
const socket = io('http://localhost:4000');

class ChatArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message : '',
      messages : [],
      isLoading : true,
      infoMsg : ''
    }
  }

  componentDidMount() {
    const {roomId} = this.props;
    this.props.dispatch(chat.getAllMessagesForChatRoom(roomId, (data) => {
      if(data.msg) {
        this.setState({
          infoMsg : data.msg,
          isLoading : false  
        })
      } else {
        this.setState({
          isLoading : false,
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
    const {username, roomId} = this.props;
    socket.emit('message', {
      message,
      author : username, 
      currentChatRoomId : roomId
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
    const {messages, isLoading} = this.state;
    if(!username) return <Redirect to="/login"/>
    
    return (
      isLoading ? 
      <p>Loading...</p> : 
      (
        <div>
          <div className="messages">
            {
              messages && messages.map(message => (
                <div>
                  <p>{message.author}</p>
                  <p>{message.message}</p>
                </div>
              ))
            }
          </div>
          <form action="" className="message-form" onSubmit={this.handleSubmit}>
            <input type="text" name="message" id="message" onChange={this.handleChange}/>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    );
  }
}

function mapStateToProps(state, ownProps) {
  console.log(ownProps)
  return {
    username : state.username,
    roomId : ownProps.match.params.roomId
  }
} 

export default connect(mapStateToProps)(ChatArea);