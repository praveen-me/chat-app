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
    })    
  }

  render() {
    const {allUsers} = this.props;
    const {isLoading, toUser, previousUser} = this.state;

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
          <MessageArea toUser={toUser || allUsers[0]}/>
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