import React, { Component } from 'react';
import {connect} from 'react-redux';
import chat from '../store/actions/chatActions';
import {Redirect, Link} from 'react-router-dom';
import socket from '../socketIo';
import Loader from './Loader';
class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading : true,
      roomName : ''
    }
  }
  
  componentDidMount() {
    this.props.dispatch(chat.getAllChatRooms((isSucced) => {
      if(isSucced) {
        this.setState({
          isLoading : false
        })
      }
    }))
    socket.emit('socket-connected', {
      id : socket.id,
      username: this.props.user.username
    })
  }

  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
 
  handleSubmit = e => {
    e.preventDefault();
    const {dispatch, history, user} = this.props;
    
    this.setState({
      isLoading : true
    })

    dispatch(chat.setChatRoom(
      {
      roomName : this.state.roomName,
      author : user.username
      },
      (isSucced) => {
        if (isSucced) {
          this.setState({
            isLoading : false
          })      
        }
      }
    ))
  }

  handleDelete = e => {
    const {id} = e.target;
    fetch(`/api/v1/chat-rooms/${id}`, {
      method : "DELETE"
    })

  }

  render() {
    const {chatRooms, user} = this.props;
    const {isLoading} = this.state;
    console.log(user)

    if(!user._id) return <Redirect to="/login" />

    return (
      <div className="list-chatroom">
        {
          isLoading ? 
          <Loader />  : 
          chatRooms.length > 0 ? (
            <div className="wrapper dashboard">
              <div className="room-list">
                <p className="select-chatroom">Chat Rooms</p>
                {
                  chatRooms && chatRooms.map((room, i) => (
                    <Link to={`/${room._id}/chat`} key={room._id} className="chatroom-block">
                      <div className="line"></div>
                      <div className="chat-room" id={room._id}>
                      {room.name}
                      </div>
                    </Link>
                  ))
                }
              </div>
              <div className="make-chatroom">
                <p className="make-chatroom">Make your own Chatroom</p>
                <form onSubmit={this.handleSubmit} className="chatroom-form"> 
                  <input type="text" name="roomName" id="" onChange={this.handleChange} className="text-field"/>
                  <button type="submit" className="btn submit">Add Chat Room</button>
                </form>
                <p className="seperator">OR</p>
                <Link to="/direct" className="direct-msg">Go to Direct Messages</Link>
              </div>
            </div>
          ) : (
            <div className="no-chat wrapper">
              <p className="seperator">OR</p>
              <p className="make-chatroom">Make your own Chatroom</p>
              <form onSubmit={this.handleSubmit} className="chatroom-form"> 
                <input type="text" name="roomName" id="" onChange={this.handleChange} className="text-field"/>
                <button type="submit" className="btn submit">Add Chat Room</button>
              </form>
            </div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user : state.user,
    chatRooms : state.chatRooms,
  }
} 

export default connect(mapStateToProps)(ChatRoom);