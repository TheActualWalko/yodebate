import {Map, List, fromJS} from "immutable";

const getNextStatementID = (state) => {
  return Math.max.apply(
    Math, 
    state.getIn(["debates", state.get("activeDebateID"), "openingStatementIDs"]).toJS()
    .concat(state.getIn(["debates", state.get("activeDebateID"), "rebuttalIDs"]).toJS())
    .concat([0])
  ) + 1;
};

const getStatementIDsKey = (state) => {
  return state.getIn(["debates", state.get("activeDebateID"), "openingStatementIDs"]).toJS().length < 2 
    ? "openingStatementIDs" 
    : "rebuttalIDs";
};

const getActiveAuthorRole = (state) => {
  if (state.getIn(["debates", state.get("activeDebateID"), "initiatorID"]) === state.get("activeAuthorID")) {
    return "initiator";
  } else if (state.getIn(["debates", state.get("activeDebateID"), "responderID"]) === state.get("activeAuthorID")) {
    return "responder";
  } else {
    return null;
  }
};

const initialState = Map({
  notification: "",
  activeDebateID: "test",
  activeAuthorID: "catman",
  debates: Map(),
  statements: Map(),
  authors: Map()
});

export default (state=initialState, {type, payload})=>{
  let toReturn;
  switch (type) {
    case "SET_ACTIVE_AUTHOR_ID":
      return state.set("activeAuthorID", payload);
    case "SET_NEW_STATEMENT_TEXT":
      return state.setIn(
        [
          "debates", 
          state.get("activeDebateID"),
          "newStatementText"
        ], 
        payload
      );
    case "SUBMIT_POSITION_STATEMENT":
    const activeAuthorRole = getActiveAuthorRole(state);
      return state
        .setIn(["debates", state.get("activeDebateID"), "newStatementText"], "")
        .setIn(
          ["debates", state.get("activeDebateID"), "positionStatements", activeAuthorRole],
          state.getIn(["debates", state.get("activeDebateID"), "newStatementText"])
        );
    case "SUBMIT_NEW_STATEMENT":
      const statementIDsKey = getStatementIDsKey(state);
      const newStatementID = getNextStatementID(state);
      return state
        .setIn(["debates", state.get("activeDebateID"), "newStatementText"], "")
        .setIn(
          ["debates", state.get("activeDebateID"), statementIDsKey],
          state
            .getIn(["debates", state.get("activeDebateID"), statementIDsKey])
            .push(newStatementID)
        )
        .setIn(
          ["statements", newStatementID], 
          Map({
            debateID: state.get("activeDebateID"),
            authorID: state.get("activeAuthorID"),
            text: state.getIn(["debates", state.get("activeDebateID"), "newStatementText"]),
            date: new Date().getTime()
          })
        );
    case "RECEIVE_AUTHOR":
      const {authorID, author} = payload;
      return state.setIn(["authors", authorID], fromJS(author));
    case "RECEIVE_DEBATE":
      const {debateID, debate, authors, statements} = payload;
      return state
        .setIn(
          ["debates", debateID],
          fromJS(debate).set("newStatementText", "")
        )
        .merge(fromJS({ authors }))
        .merge(fromJS({ statements }));
    default:
      return state;
  }
};

