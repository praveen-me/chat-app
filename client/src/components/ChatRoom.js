import React, { Component } from 'react';
import {connect} from 'react-redux';
import chat from '../store/actions/chatActions';
import {Redirect, Link} from 'react-router-dom';

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
  }

  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
 
  handleSubmit = e => {
    e.preventDefault();
    const {dispatch, history, username} = this.props;
    
    this.setState({
      isLoading : true
    })

    dispatch(chat.setChatRoom(
      {
      roomName : this.state.roomName,
      author : username
      },
      (isSucced) => {
        if(isSucced) {
          // history.push(`/${this.state.roomName}`)
          this.setState({
            isLoading : false
          })      
        }
      }
    ))
  }

  render() {
    const {chatRooms, username} = this.props;
    console.log(chatRooms)
    const {isLoading} = this.state;

    if(!username) return <Redirect to="/login" />

    return (
      <div className="list-chatroom">
        {
          isLoading ? 
          <p>Loading...</p> : 
          chatRooms.length > 0 ? (
            <div>
                {
                  chatRooms && chatRooms.map(room => (
                    <Link to={`/${room._id}/chat`} key={room._id}>
                      <div className="chat-room" id={room._id}>
                      {room.name}
                      </div>
                    </Link>
                  ))
                }
                OR
                <p>Make your own Chatroom.</p>
                <form onSubmit={this.handleSubmit}> 
                  <input type="text" name="roomName" id="" onChange={this.handleChange}/>
                  <button type="submit">Add Chat Room</button>
                </form>
              </div>
          ) : (
            <div className="no-chat">
              <p>No chatroom available.</p>
              <p>Make your own Chatroom.</p>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="roomName" id="" onChange={this.handleChange}/>
                <button type="submit">Add Chat Room</button>
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
    username : state.username,
    chatRooms : state.chatRooms,
  }
} 

export default connect(mapStateToProps)(ChatRoom);