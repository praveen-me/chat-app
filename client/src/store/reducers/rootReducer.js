const initState = {
  user : {},
  chatRooms : []
}

function rootReducer(state = initState, action) {
  switch(action.type) {
    case 'LOGIN_SUCCESS' : {
      return {
        ...state,
        user : action.user
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