const auth =  {
  login : (data, cb) => {
    return dispatch => {
      fetch('/api/v1/login', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
      })
        .then(res => {
          if(res.status === 200) {
            res.json()
              .then(data => {
                dispatch({
                  type: 'LOGIN_SUCCESS',
                  user: data.data
                })
                return cb(true);
              })
          }else {
            res.json()
              .then(data => cb(data))
          }
        })
    }
  },
  signUp : (data,  cb) => {
    console.log(data);
    return dispatch => {
      fetch('/api/v1/signup', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
      })
        .then(res => {
          if (res.status === 200) {
            cb(true)
            return dispatch({
              type : 'SIGNUP_SUCCESS'
            })
          } else {
            res.json()
              .then(data => cb(data))
          }
        })
    }
  },
  logOut : () => {
    return (dispatch) => {
      console.log('logout called in actions')
      fetch('/api/v1/logout')
        .then(res => res.json())
        .then(data => {
          console.log(data)
          return dispatch({
            type : 'LOGOUT_SUCCESSFULL'
          })
        })
    }
  }, 
  getAllUsers: (cb) => {
    return (dispatch) => {
      console.log('getting all users')
      fetch('/api/v1/users')
        .then(res => res.json())
        .then(data => {
          dispatch({
            type : 'GET_ALL_USERS',
            users : data.users
          })
          return cb(true);
        }) 
    }
  }
} 

export default auth;