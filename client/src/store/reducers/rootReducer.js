const initState = {
  username : null
}

function rootReducer(state = initState, action) {
  switch(action.type) {
    case "SET_USER" : {
      return {
        username : action.data
      }
    }

    default: return state;
  }
}

export default rootReducer;