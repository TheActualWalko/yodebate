import api from "./api";

export const receiveAuthor = ({ authorID, author })=>({
  type: "RECEIVE_AUTHOR",
  payload: { authorID, author }
});

export const authorError = ({ authorID, error })=>({
  type: "AUTHOR_ERROR",
  payload: { authorID, error }
});

export const getAuthor = (authorID) => {
  return (dispatch, getState) => {
    dispatch({
      type: "REQUEST_AUTHOR",
      payload: { authorID }
    });
    api("getAuthor", { authorID })
      .then((author)=>dispatch(receiveAuthor({ authorID, author })))
      .catch((error)=>dispatch(authorError({ authorID, error })));
  }
}

export const setActiveAuthorID = (authorID) => {
  return (dispatch, getState) => {
    api("authenticate", { authorID })
      .then((author)=>{
        dispatch({ 
          type: "SET_ACTIVE_AUTHOR_ID", 
          payload: { authorID } 
        });
        dispatch(receiveAuthor({ authorID, author }));
      })
      .catch((error)=>dispatch(authorError({ authorID, error })));
  };
}