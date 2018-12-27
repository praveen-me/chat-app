const  auth =  {
  setUser : (data, cb) => {
    console.log(data)
    cb(true);
    return {
      type : 'SET_USER',
      data
    }
  }
} 

export default auth;