import React, { Component } from 'react';
import auth from '../store/actions/authActions';
import {connect} from 'react-redux';

class LogIn extends Component {
  state = {
    username : ''
  }

  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const {username} = this.state;
    const {dispatch, history} = this.props;

    dispatch(auth.setUser(username, (isSucced) => {
      if(isSucced) {
        history.push('/')   
      }
    }))
  }

  render() {
    return (
      <div>
        <form className="user-form" onSubmit={this.handleSubmit}>
          <input type="text" name="username" id="" onChange={this.handleChange}/>
          <button type="submit">Go Ahead</button>
        </form>
      </div>
    );
  }
}

export default connect()(LogIn);