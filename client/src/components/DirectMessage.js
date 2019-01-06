import React, { Component } from 'react';
import {connect} from 'react-redux';
import auth from '../store/actions/authActions';
import socket from '../socketIo';
import chat from '../store/actions/chatActions';

class DirectMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      toUser: {},
      populatedData : {},
      message : '', 
      messages : []
    }
  }
  
  componentDidMount() {
    this.props.dispatch(auth.getAllUsers((isDone) => {
      if(isDone) {
        this.setState({
          isLoading : false
        }, () => {
          const {user, allUsers} = this.props;
          fetch(`/api/v1/messages?user1=${user._id}&user2=${allUsers[0]._id}`)
          this.getPopulatedMessages(user._id, allUsers[0]._id)
        })
      }
    })) 
  }
  
  handleSubmit = e => {
    e.preventDefault();
    const {message, populatedData, toUser} = this.state;
    const {user} = this.props;
    if (navigator.onLine) {
      socket.emit('direct-message', {
        message,
        user1: !populatedData.msg ?  populatedData.user1 === user._id ? user._id : toUser.userId : user._id,
        user2: !populatedData.msg ? populatedData.user2 === toUser.userId ? toUser.userId : user._id : toUser.userId,
        author: user.username,
        to: toUser.username
      })
      this.getPopulatedMessages(user._id, toUser.userId);
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

    this.setState(state => ({
      ...state,
      previousUser : state.toUser,
      toUser : {
        ...state.currentUser,
        userId : id,
        username : innerHTML 
      }
    }), () => {
      this.getPopulatedMessages(user._id, id);
    })    
  }

  getPopulatedMessages = (user1, user2) => {
    chat.getAllPrivateMessages(user1, user2, (data) => {
      if(data.msg) {
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

  getMessage = (()  =>{
    socket.on('directChat', (msg) => {
      const {toUser} = this.state;
      const {user} = this.props;
      if(toUser.username === msg.author || msg.to === toUser.username) {
        this.setState({
          messages : [...this.state.messages, msg]
        })
      }
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
    const {isLoading, toUser, populatedData, messages} = this.state;

    return (
      isLoading ? <p>Loading...</p> : (
        <div className="direct-messages">
          <div className='users-list'>
            <h2 className="users-header">Users</h2>
            {
              allUsers && allUsers.map(user => (
                <div className='user-block' id={user._id} key={user._id}> 
                  <button onClick={this.handleClick} id={user._id}>{user.username}</button>
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
              !populatedData.msg ? messages && messages.map(message => (
                <div className={`message-block ${message.author === user.username ? 'block-right ': ''}`}>
                    <div className={` message-sub_block ${message.author === user.username ? 'right-sub_block': ''}`}>
                      <p className="message-text">{message.message}</p>
                      {
                        message.author === user.username ? <button className="delete-message" id={message._id ? message._id : ''} onClick={this.handleDelete}>x</button> : ''
                      }
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