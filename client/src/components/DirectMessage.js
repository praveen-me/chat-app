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
        })
      }
     })) 
  }
  
  handleClick = e => {
    e.preventDefault();
    const {id, innerHTML} = e.target;
    console.log(e.target.id)
    this.setState(state => ({
      ...state,
      toUser : {
        ...state.currentUser,
        userId : id,
        username : innerHTML 
      }
    }))    
  }

  render() {
    const {allUsers} = this.props;
    const {isLoading} = this.state;

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
          <MessageArea toUser={this.state.toUser}/>
        </div>
      )    
    );
  }
}

function mapStateToProps(state) {
  return {
    allUsers : state.allUsers
  }
}

export default connect(mapStateToProps)(DirectMessage);