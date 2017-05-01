import socketClient = require("socket.io-client");
const socket = socketClient("http://localhost:3003");
import store from './store';

socket.on("connect", ()=>{
  store.dispatch(setActiveAuthorID(getAuthorID()));
});

const getAuthorID = ()=>{
  const location = window.location.href;
  let nextLocation;
  const storage = window.localStorage;
  let authorIDfromURL;
  if (location.indexOf("?authorID=") >= 0) {
    authorIDfromURL = location.split("?authorID=")[1].split("&")[0];
  } else if (location.indexOf("&authorID=") >= 0) {
    authorIDfromURL = location.split("&authorID=")[1].split("&")[0];
  }
  if (authorIDfromURL) {
    storage.setItem("authorID", authorIDfromURL);
    if (location.indexOf("?authorID="+authorIDfromURL+"&") >= 0) {
      nextLocation = location.replace("?authorID="+authorIDfromURL+"&", "");
    } else if (location.indexOf("?authorID="+authorIDfromURL) >= 0) {
      nextLocation = location.replace("?authorID="+authorIDfromURL, "");
    } else if (location.indexOf("authorID="+authorIDfromURL+"&") >= 0) {
      nextLocation = location.replace("authorID="+authorIDfromURL+"&", "");
    } else {
      nextLocation = location.replace("authorID="+authorIDfromURL, "");
    }
    window.location.href = nextLocation;
  }
  if (storage.getItem("authorID")) {
    return storage.getItem("authorID");
  }
};

export const setActiveAuthorID = (authorID) => {
  return (dispatch, getState) => {
    socket.emit("authenticate", authorID);
    dispatch({
      type: "SET_ACTIVE_AUTHOR_ID",
      payload: authorID
    })
  };
}

export const setNewStatementText = (text) => {
  return {
    type: "SET_NEW_STATEMENT_TEXT",
    payload: text
  }
}

export const submitPositionStatement = () => {
  return (dispatch, getState) => {
    const state = getState().toJS();
    socket.emit(
      "setPositionStatement", 
      state.activeDebateID,
      state.debates[state.activeDebateID].newStatementText,
      ()=>dispatch({ type: "SUBMIT_POSITION_STATEMENT" })
    );
  }
}

export const submitNewStatement = () => {
  return (dispatch, getState) => {
    const state = getState().toJS();
    socket.emit(
      "addStatement", 
      state.activeDebateID,
      state.debates[state.activeDebateID].newStatementText,
      ()=>dispatch({ type: "SUBMIT_NEW_STATEMENT" })
    );
  }
}

export const getActiveDebate = () => {
  return (dispatch, getState) => {
    const debateID = getState().get("activeDebateID");
    socket.emit("getDebate", debateID, (debate, authors, statements)=>{
      dispatch({
        type: "RECEIVE_DEBATE",
        payload: {
          debateID,
          debate,
          authors,
          statements
        }
      });
    });
  }
}

export const getAuthor = (authorID) => {
  return (dispatch, getState) => {
    socket.emit("getAuthor", authorID, (author)=>{
      dispatch({
        type: "RECEIVE_AUTHOR",
        payload: {
          authorID,
          author
        }
      });
    });
  }
}