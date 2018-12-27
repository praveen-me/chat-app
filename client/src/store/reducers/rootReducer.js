const initState = {
  username : null,
  chatRooms : []
}

function rootReducer(state = initState, action) {
  switch(action.type) {
    case "SET_USER" : {
      return {
        ...state,
        username : action.data
      }
    }

    default: return state;
  }
}

export default rootReducer;