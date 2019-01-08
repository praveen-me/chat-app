import React, { Component } from 'react';
import {connect} from 'react-redux';
import auth from '../store/actions/authActions';
import socket from '../socketIo';
import chat from '../store/actions/chatActions';
import mp3 from './../assets/quite-impressed.mp3'


class DirectMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      toUser: {},
      populatedData : {},
      message : '', 
      messages : [],
      onlineUsers : []
    }
  }
  
  componentDidMount() {
    socket.emit('socket-connected', {})
    this.props.dispatch(auth.getAllUsers((isDone) => {
      if(isDone) {
        this.setState({
          isLoading : false,
          toUser : this.props.allUsers[0]
        }, () => {
          const {user, allUsers} = this.props;
          this.getPopulatedMessages(user._id, allUsers[0]._id)
        })
      }
    })) 
  }
  
  handleSubmit = e => {
    e.preventDefault();
    const {message, messages, populatedData, toUser} = this.state;
    const {user} = this.props;
    if (navigator.onLine) {
      socket.emit('direct-message', {
        message,
        user1: user._id,
        user2: toUser.userId || toUser._id,
        author: user.username,
        to: toUser.username
      })
      document.getElementById('message').value = '';
    } else {
      this.setState({
        infoMsg : 'Internet not available. Please connected to secure connection.'
      })
    }

  }

  handleClick = e => {
    e.preventDefault();      
    const {id, innerHTML} = e.target;
    const {user} = this.props;
    this.getPopulatedMessages(user._id, id);
    
    this.setState(state => ({
      ...state,
      toUser : {
        ...state.currentUser,
        userId : id,
        username : innerHTML 
      }
    }))    
  }

  getPopulatedMessages = (user1, user2) => {
    chat.getAllPrivateMessages(user1, user2, (data) => {
      if(data.msg) {
        console.log(data)
        this.setState({
          messages : [],
          populatedData : data
        })
      } else {
        const {user1, user2, messages} = data.data;
        this.setState({
          messages : messages,
          populatedData : {
            user1,
            user2 
          }
        })
      }
    })
  }

  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  getMessage = (() => {
    socket.on('directChat', (msg) => {
      const {toUser} = this.state;
      const {user} = this.props;
      if(toUser.username === msg.author || msg.to === toUser.username) {
        this.setState({
          messages : [...this.state.messages, msg]
        })
      }
      if(msg.author !== user.username) {
        const audio = document.getElementById('audio').play();
      }
    })
  })()

  getOnlineUsers = (() => {
    socket.on('online-users', (users) => {
      console.log(users)
      this.setState({
        onlineUsers : [...users] 
      })
    })
  })()

  handleDelete = e => {
    const {populatedData, toUser} = this.state;
    console.log(toUser)
    const {user} = this.props;
    if (navigator.onLine) {
      fetch(`/api/v1/messages/${e.target.id}?user1=${populatedData.user1}&user2=${populatedData.user2}`, {
        method : 'DELETE'
      })
        .then(res => res.json())
        .then(data => {
          if(data.msg) {
            this.getPopulatedMessages(user._id, toUser.userId);
          }
        })
    }
  }

  render() {
    const {allUsers, user} = this.props;
    const {isLoading, toUser, populatedData, messages, onlineUsers} = this.state;
    
    return (
      isLoading ? <p>Loading...</p> : (
        <div className="direct-messages">
          <div className='users-list'>
            <audio src={mp3} controls id="audio"/>
          <h2 className="users-header">Users</h2>
          {
            allUsers && allUsers.map(user => (
              <div className='user-block' id={user._id} key={user._id}> 
                    <button onClick={this.handleClick} id={user._id}>{user.username}</button>
                    <span className={`indicator ${onlineUsers.includes(user.username) ? 'green-dot' : 'red-dot'}`}></span>
                  </div>
                ))
            }
            </div>
          <div className="direct-chat-area chat-area">
            <div className="current-user">
              <h3>{toUser.username  || allUsers[0].username }</h3>
            </div>
            <div className="messages wrapper">
            {
                populatedData.msg !== '' ? messages && messages.map(message => (
                  <div className={`message-block ${message.author === user.username ? 'block-right ': ''}`} key={message._id}>
                      <div className={` message-sub_block ${message.author === user.username ? 'right-sub_block': ''}`}>
                        <p className="message-text">{message.message}</p>
                      </div>
                      {
                        !messages.length ? <p>{`${infoMsg} ${user.username}`}</p> : ''
                      }
                    </div>
                )) : <p className="warn-msg">{`${populatedData.msg.slice(0, populatedData.msg.length - 1)} ${user.username}.`}</p>
              }
            </div>
            <form action="" className="direct-message-form message-form" onSubmit={this.handleSubmit}>
              <input type="text" name="message" id="message" onChange={this.handleChange} className="text-field"/>
              <button type="submit" className="btn">Submit</button>
            </form>
          </div>
        </div>
      )    
    );
  }
}

function mapStateToProps(state) {
  return {
    allUsers : state.allUsers,
    user : state.user
  }
}

export default connect(mapStateToProps)(DirectMessage);