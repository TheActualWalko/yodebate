import {Map, List, fromJS} from "immutable";

const getNextDebateID = (state, debateID) => {
  return Math.max.apply(
    Math, 
    state.getIn(["debates", debateID, "openingStatementIDs"]).toJS()
    .concat(state.getIn(["debates", debateID, "rebuttalIDs"]).toJS())
    .concat([0])
  ) + 1;
};

const getStatementIDsKey = (state, debateID) => {
  return state.getIn(["debates", debateID, "openingStatementIDs"]).toJS().length < 2 
    ? "openingStatementIDs" 
    : "rebuttalIDs";
};

const getActiveUserRole = (state, debateID) => {
  if (state.getIn(["debates", debateID, "initiatorID"]) === state.get("activeUserID")) {
    return "initiator";
  } else if (state.getIn(["debates", debateID, "responderID"]) === state.get("activeUserID")) {
    return "responder";
  } else {
    return null;
  }
};

const initialState = Map({
  notification: "",
  activeDebateID: 1,
  activeUserID: 1,
  debateIDs: List([1]),
  debates: Map([[
    1, Map({
      initiatorID: 1,
      responderID: 2,
      positionStatements: Map({
        initiator: null,
        responder: null
      }),
      openingStatementIDs: List(),
      rebuttalIDs: List(),
      isOver: false,
      newStatementText: ""
    })
  ]]),
  statements: Map(),
  authors: Map([
    [1, Map({
      imageURL: "http://www.rd.com/wp-content/uploads/sites/2/2016/04/01-cat-wants-to-tell-you-laptop.jpg",
      name: "Catman",
      description: "Rocket Scientist"
    })],
    [2, Map({
      imageURL: "https://images-na.ssl-images-amazon.com/images/G/01/img15/pet-products/small-tiles/23695_pets_vertical_store_dogs_small_tile_8._CB312176604_.jpg",
      name: "Dogwoman",
      description: "Particle Physicist"
    })]
  ])
});

export default (state=initialState, {type, payload})=>{
  let toReturn;
  switch (type) {
    case "SET_NEW_STATEMENT_TEXT":
      return state.setIn(
        [
          "debates", 
          payload.debateID, 
          "newStatementText"
        ], 
        payload.text
      );
    case "SUBMIT_POSITION_STATEMENT":
    const activeUserRole = getActiveUserRole(state, payload);
      return state
        .setIn(["debates", payload, "newStatementText"], "")
        .setIn(
          ["debates", payload, "positionStatements", activeUserRole],
          state.getIn(["debates", payload, "newStatementText"])
        );
    case "SUBMIT_NEW_STATEMENT":
      const statementIDsKey = getStatementIDsKey(state, payload);
      const newStatementID = getNextDebateID(state, payload);
      const nextAuthorID = state.get("activeUserID") === 1 ? 2 : 1;
      return state
        .setIn(["debates", payload, "newStatementText"], "")
        .setIn(
          ["debates", payload, statementIDsKey],
          state
            .getIn(["debates", payload, statementIDsKey])
            .push(newStatementID)
        )
        .setIn(
          ["statements", newStatementID], 
          Map({
            debateID: payload,
            authorID: state.get("activeUserID"),
            text: state.getIn(["debates", payload, "newStatementText"]),
            date: new Date().getTime()
          })
        )
        .set("activeUserID", nextAuthorID)
        .set("notification", `Automatically switching sides. You are now ${state.getIn(["authors", nextAuthorID, "name"])}`);
    default:
      return state;
  }
};

