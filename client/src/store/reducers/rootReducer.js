const initState = {
  username : null,
  chatRooms : []
}

function rootReducer(state = initState, action) {
  switch(action.type) {
    case 'SET_USER' : {
      return {
        ...state,
        username : action.data
      }
    }

    case 'SET_ALL_CHATROOMS' : {
      console.log(action.chatRooms, "in reducer")
      return {
        ...state,
        chatRooms : action.chatRooms 
      }
    }

    default: return state;
  }
}

export default rootReducer;