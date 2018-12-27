import React, { Component } from 'react';
import {connect} from 'react-redux';

class ChatRoom extends Component {
  render() {
    const {chatRooms} = this.props;
    return (
      <div className="list-chatroom">
        {
          chatRooms.length > 0 ? (
            chatRooms.map(room => (
              <div className="chat-room" key={room._id} id={room._id}>
              {room.name}
              </div>
            ))
          ) : (
            <div className="no-chat">
              <p>No chatroom available.</p>
              <p>Make your own Chatroom.</p>
              <form>
                <input type="text" name="roomName" id=""/>
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
    chatRooms : state.chatRooms
  }
} 

export default connect(mapStateToProps)(ChatRoom);