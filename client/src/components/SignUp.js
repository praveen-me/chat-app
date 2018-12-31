import React, { Component } from 'react';
import auth from '../store/actions/authActions';
import { connect } from 'react-redux';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading : false,
      userDetails : {
        username: '',
        fullName: '',
        password: '',
        email: ''
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
    this.props.dispatch(auth.signUp(this.state.userDetails))
  }

  render() {
    return (
      <main className="form-wrapper">
        <div className="start-block middle">
          <form className="user-form" onSubmit={this.handleSubmit}>
            <label htmlFor="fullName">
              Enter your fullname
            </label>
            <input type="text" name="fullName" onChange={this.handleChange} className="text-field"/>
            <label htmlFor="email">
              Enter your email
            </label>
            <input type="email" name="email" onChange={this.handleChange} className="text-field"/>
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

export default connect()(SignUp);