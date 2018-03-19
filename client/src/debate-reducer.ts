import {Map, fromJS} from "immutable";
const defaultNewDebate = {
  positionStatements: {
    initiator: ""
  },
  statementIDs: [],
  newStatementText: ""
};
export default (
  state=Map({
    activeDebateID: "test",
    byID: fromJS({
      "new": defaultNewDebate
    })
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
    case "SET_NEW_DEBATE_POSITION_STATEMENT":
      return state
        .setIn(
          ["byID", "new", "positionStatements", "initiator"],
          state.getIn(["byID", "new", "newStatementText"])
        )
        .setIn(
          ["byID", "new", "newStatementText"],
          ""
        );
    case "SET_NEW_STATEMENT_TEXT":
      return state.setIn(
        ["byID", payload.debateID, "newStatementText"],
        payload.text
      );
    default: 
      return state;
  }
};