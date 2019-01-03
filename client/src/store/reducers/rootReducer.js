const initState = {
  user : {},
  chatRooms : [],
  allUsers : {}
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

    case 'LOGOUT_SUCCESSFULL' : {
      console.log('logout called in reducer')
      return {
        ...state,
        user : {},
        chatRooms : [],
      }
    }

    case 'GET_ALL_USERS': {
      return {
        ...state,
        allUsers : action.users
      }
    }

    default: return state;
  }
}

export default rootReducer;