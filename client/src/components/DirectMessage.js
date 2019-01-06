import React, { Component } from 'react';
import {connect} from 'react-redux';
import auth from '../store/actions/authActions';
import socket from '../socketIo';


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
        })
      }
    })) 
  }
  
  handleSubmit = e => {
    e.preventDefault();
    const {message, populatedData, toUser} = this.state;
    const {user} = this.props;
    console.log(toUser)
    if (navigator.onLine) {
      socket.emit('direct-message', {
        message,
        user1: !populatedData.msg ?  populatedData.user1 === user._id ? user._id : toUser.userId : user._id,
        user2: !populatedData.msg ? populatedData.user2 === toUser.userId ? toUser.userId : user._id : toUser.userId,
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

  handleClick = e => {
    e.preventDefault();
    const {id, innerHTML} = e.target;
    const {user} = this.props;

    console.log(e.target.id)
    this.setState(state => ({
      ...state,
      previousUser : state.toUser,
      toUser : {
        ...state.currentUser,
        userId : id,
        username : innerHTML 
      }
    }), () => {
      fetch(`/api/v1/messages?user1=${user._id}&user2=${id}`)
        .then(res => {
          res.status === 302 ? 
            res.json()
              .then(data => {
                this.setState({
                  messages : [],
                  populatedData : data
                })
              })
            : res.json()
              .then(data => {
                const {user1, user2, messages} = data.data
                this.setState({
                  messages : messages,
                  populatedData : {
                    user1,
                    user2 
                  }
                })
              })
        })
    })    
  }

  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  getMessage = (()  =>{
    socket.on('directChat', (msg) => {
      console.log(msg)
      const {toUser} = this.state;
      const {user} = this.props;
      if(toUser.username === msg.author || msg.to === toUser.username) {
        this.setState({
          messages : [...this.state.messages, msg]
        })
      }
    })
  })()

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