import {Map, fromJS} from "immutable";
export default (
  state=Map({
    activeAuthorID: null,
    byID: Map()
  }), 
  {type, payload}
) => {
  switch (type) {
    case "SET_ACTIVE_AUTHOR_ID":
      return state
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