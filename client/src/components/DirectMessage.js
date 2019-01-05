import React, { Component } from 'react';
import {connect} from 'react-redux';
// import UsersList from './UsersList';
import auth from '../store/actions/authActions';
import MessageArea from './MessageArea';

class DirectMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      toUser: null,
      messagesData : null,
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
        .then(res => res.json())
        .then(data => this.setState({
          messages : data
        }))
    })    
  }

  render() {
    const {allUsers} = this.props;
    const {isLoading, toUser, previousUser, messages} = this.state;

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
            <h3>{allUsers[0].username || toUser.username }</h3>
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