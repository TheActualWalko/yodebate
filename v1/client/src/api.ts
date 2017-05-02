import store from "./store";
import socketClient = require("socket.io-client");
const socket = socketClient("http://localhost:3003");

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

const api = (endpoint, payload) => {
  return new Promise((resolve, reject)=>{
    socket.emit(endpoint, payload, resolve, reject);
  });
};

export const setActiveAuthorID = (authorID) => {
  return (dispatch, getState) => {
    api("authenticate", {authorID});
    dispatch({
      type: "SET_ACTIVE_AUTHOR_ID",
      payload: authorID
    })
  };
}

socket.on("connect", ()=>{
  store.dispatch(setActiveAuthorID(getAuthorID()));
});

export default api;