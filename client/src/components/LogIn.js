import React, { Component } from 'react';
import auth from '../store/actions/authActions';
import {connect} from 'react-redux';
import styled, {css} from 'styled-components';


const FormHead = styled.h1`
  font-size : 1.5rem;
  color : red;
`

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading : false,
      errMSg : '',
      userDetails : {
        username: '',
        password: '',
      }
    }
  }

  handleChange = e => {
    this.setState({
      ...this.state,
      userDetails : {
        ...this.state.userDetails,
        [e.target.name] : e.target.value
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const {username} = this.state;
    const {dispatch, history} = this.props;

    dispatch(auth.login(this.state.userDetails, (isSucced) => {
      if(isSucced) {
        history.push('/')   
      }
    }))
  }

  render() {
    return (
      <main className="form-wrapper">
        <div className="start-block middle">
          <form className="user-form" onSubmit={this.handleSubmit}>
          <label htmlFor="username">
            Enter your username
          </label>
          <input type="text" name="username" onChange={this.handleChange} className="text-field"/>
          <label htmlFor="password">
            Enter your password
          </label>
          <input type="password" name="password" onChange={this.handleChange} className="text-field"/>
            <div className="right">
              <button type="submit" className="btn submit">Go Ahead</button>
            </div>
          </form>
        </div>
      </main>
    );
  }
}

export default connect()(LogIn);