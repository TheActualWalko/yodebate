import {Map, List, fromJS} from 'immutable';

const assign = (x,y)=>{
  return Object["assign"]({},x,y);
};

const longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem itaque esse est eum tempore, hic quibusdam ducimus ipsum, quos nam autem rem, magni libero consequatur voluptatem id deleniti repudiandae odit iusto ad nostrum perferendis obcaecati officiis nisi deserunt! Deleniti sit omnis iure dolor, totam perferendis magnam voluptas porro culpa aliquid?";

const shortText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem itaque esse est eum tempore, hic quibusdam ducimus ipsum, quos nam autem rem, magni libero consequatur voluptatem id deleniti repudiandae odit iusto ad nostrum perfer?";


const initialState = Map({
  activeDebateID: 1,
  activeUserID: 1,
  debateIDs: List([1]),
  debates: Map([[
    1, Map({
      initiatorID: 1,
      responderID: 2,
      positionStatements: Map({
        initiator: "I eat dogs",
        responder: "I am dog"
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
    case "SUBMIT_NEW_STATEMENT":
      const statementIDsKey = state.getIn(["debates", payload, "openingStatementIDs"]).toJS().length < 2 
        ? "openingStatementIDs" 
        : "rebuttalIDs";
      const newStatementID = Math.max.apply(
        Math, 
        state.getIn(["debates", payload, "openingStatementIDs"]).toJS()
        .concat(state.getIn(["debates", payload, "rebuttalIDs"]).toJS())
        .concat([0])
      ) + 1; // TODO
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
            text: state.getIn(["debates", payload, "newStatementText"]),
            date: new Date().getTime()
          })
        )
        .set("activeUserID", state.get("activeUserID") === 1 ? 2 : 1);
    default:
      return state;
  }
};

