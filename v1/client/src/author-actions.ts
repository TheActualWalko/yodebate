declare const FB: any;

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
    FB.api(authorID + "?fields=name, picture", (response)=>{
      if (response.error) {
        dispatch(authorError({authorID, error: response.error}));
      } else {
        dispatch({
          type: "RECEIVE_AUTHOR",
          payload: {
            authorID,
            author: {
              name: response.name,
              imageURL: response.picture.data.url,
              description: "Early Adopter"
            }
          }
        });
      }
    });
  }
}

export const facebookLogin = ()=>{
  return (dispatch, getState) => {
    FB.login(
      response=>dispatch(receiveFacebookLoginStatus(response)),
      {scope: 'public_profile'}
    );
  };
};

export const receiveFacebookLoginStatus = ({status, authResponse}) => {
  if (status === "connected") {
    return receiveFacebookSession(authResponse);
  } else {
    return receiveUnauthenticated()
  }
}

export const receiveFacebookSession = (authResponse) => {
  return (dispatch, getState) => {
    api("authenticate", { facebookToken: authResponse.accessToken })
      .then(({ authorID })=>{
        dispatch({ 
          type: "SET_ACTIVE_AUTHOR_ID", 
          payload: { authorID } 
        });
        dispatch(getAuthor(authorID));
      })
      .catch((error)=>dispatch(authorError({ authorID: null, error })));
  };
};

export const receiveUnauthenticated = ()=>({
  type: "RECEIVE_UNAUTHENTICATED"
});