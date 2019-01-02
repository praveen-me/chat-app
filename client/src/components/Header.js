import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Header extends Component {
  render() {
    const {user} = this.props;
    
    return (
      <header>  
        <div className="wrapper">
          <h1 className="logo">Chit Chatter</h1>
          {
            !user._id ? (
              <div className="auth-buttons">
                <Link to="/signup" className="auth-buttons">
                  Sign Up
                </Link>
                <Link to="/login" className="auth-buttons">
                  Log In
                </Link>
              </div>
            ) : (
              <div className="auth-buttons">
                <a className="auth-buttons">
                  Log out
                </a>
              </div>
            )
          }
        </div>
      </header> 
    );
  }
}

function mapStateToProps(state) {
  return {
    user : state.user
  }
}

export default connect(mapStateToProps)(Header);