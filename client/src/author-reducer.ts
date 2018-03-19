import {Map, fromJS} from "immutable";
export default (
  state=Map({
    activeAuthorID: null,
    authTested: false,
    byID: Map()
  }), 
  {type, payload}
) => {
  switch (type) {
    case "RECEIVE_UNAUTHENTICATED":
      return state
        .set("authTested", true)
        .set("activeAuthorID", null);
    case "SET_ACTIVE_AUTHOR_ID":
      return state
        .set("authTested", true)
        .set("activeAuthorID", payload.authorID);
    case "AUTHOR_ERROR":
      return state.setIn(
        ["byID", payload.authorID], 
        state
          .getIn(["byID", payload.authorID], Map())
          .merge(Map({ 
            isLoading: false,
            isLoaded: false,
            error: payload.error
          }))
      );
    case "REQUEST_AUTHOR":
      return state.setIn(
        ["byID", payload.authorID], 
        state
          .getIn(["byID", payload.authorID], Map())
          .merge(Map({ 
            isLoading: true,
            isLoaded: false,
            error: null
          }))
      );
    case "RECEIVE_AUTHOR":
      return state.setIn(
        ["byID", payload.authorID], 
        state
          .getIn(["byID", payload.authorID], Map())
          .merge(fromJS(payload.author))
          .merge(Map({ 
            isLoading: false,
            isLoaded: true,
            error: null
          }))
      );
    default:
      return state;
  }
};