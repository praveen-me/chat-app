const auth =  {
  setUser : (data, cb) => {
    console.log(data)
    cb(true);
    return {
      type : 'SET_USER',
      data
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
        .then(res => res.json())

    }
  }
} 

export default auth;