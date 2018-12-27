const uri = 'http://localhost:4000/api/v1'

const chat = {
  getAllChatRooms : (cb) => {
    console.log('called')
    return (dispatch) => {
      fetch(`${uri}/chat-rooms`)
      .then(res => res.json())
      .then(data => {
        cb(true)
        console.log(data);
      });
    }
  },
  setChatRoom : (data, cb) => {
    console.log('called')
    return (dispatch) => {
      fetch(`${uri}/chat-rooms`, {
        method : 'POST', 
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
        cb(true)
        console.log(data);
      });
    }
  }
}

export default chat;