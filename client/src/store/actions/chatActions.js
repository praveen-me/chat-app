const uri = 'http://localhost:4000/api/v1';

const chat = {
  getAllChatRooms : (cb) => {
    return (dispatch) => {
      fetch(`${uri}/chat-rooms`)
      .then(res => {
        if(res.status === 302) {
          res.json()
            .then((data) => cb(data.msg))
        } else {
          res.json()
            .then(data => {
              cb(true);
              console.log(data)
              return dispatch({
              type : 'SET_ALL_CHATROOMS',
                chatRooms : data.chatRooms
              })
            })
        }
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
        return dispatch({
          type : 'SET_ALL_CHATROOMS',
          chatRooms : data.chatRooms
        })
      });
    }
  },
  getAllMessagesForChatRoom : (chatRoomId, cb) => {
    return (dispatch) => {
      fetch(`${uri}/chat-rooms/${chatRoomId}`)
        .then(res => res.json())
        .then(data => {
          cb(data)
        })
    }
  }
}

export default chat;