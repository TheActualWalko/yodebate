import {Map, fromJS} from "immutable";
export default (
  state=Map({
    activeDebateID: "test",
    byID: Map()
  }), 
  {type, payload}
) => {
  switch (type) {
    case "SET_ACTIVE_DEBATE_ID":
      return state
        .set("activeDebateID", payload.debateID);
    case "DEBATE_ERROR":
      return state.setIn(
        ["byID", payload.debateID], 
        state
          .getIn(["byID", payload.debateID], Map())
          .merge(Map({ 
            isLoading: false,
            isLoaded: false,
            error: payload.error
          }))
      );
    case "REQUEST_DEBATE":
      return state.setIn(
        ["byID", payload.debateID], 
        state
          .getIn(["byID", payload.debateID], Map())
          .merge(Map({ 
            isLoading: true,
            isLoaded: false,
            error: null
          }))
      );
    case "RECEIVE_DEBATE":
      return state.setIn(
        ["byID", payload.debateID], 
        state
          .getIn(["byID", payload.id], Map())
          .merge(fromJS(payload.debate))
          .merge(Map({ 
            isLoading: false,
            isLoaded: true,
            error: null
          }))
      );
    case "SET_NEW_STATEMENT_TEXT":
      return state.setIn(
        ["byID", state.get("activeDebateID"), "newStatementText"],
        payload.text
      );
    default: 
      return state;
  }
};