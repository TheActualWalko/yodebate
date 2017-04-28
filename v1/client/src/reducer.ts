const assign = (x,y)=>{
  return Object["assign"]({},x,y);
};

const longText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem itaque esse est eum tempore, hic quibusdam ducimus ipsum, quos nam autem rem, magni libero consequatur voluptatem id deleniti repudiandae odit iusto ad nostrum perferendis obcaecati officiis nisi deserunt! Deleniti sit omnis iure dolor, totam perferendis magnam voluptas porro culpa aliquid?";

const shortText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem itaque esse est eum tempore, hic quibusdam ducimus ipsum, quos nam autem rem, magni libero consequatur voluptatem id deleniti repudiandae odit iusto ad nostrum perfer?";


const initialState = {
  activeDebateID: 1,
  activeUserID: 1,
  debateIDs: [1],
  debates: {
    1: {
      initiatorID: 1,
      responderID: 2,
      positionStatements: {
        initiator: "I eat dogs",
        responder: "I am dog"
      },
      openingStatementIDs: [],
      rebuttalIDs: [],
      isOver: false,
      newStatementText: ""
    }
  },
  statements: {
  },
  authors: {
    1: {
      imageURL: "http://www.rd.com/wp-content/uploads/sites/2/2016/04/01-cat-wants-to-tell-you-laptop.jpg",
      name: "Catman",
      description: "Rocket Scientist"
    },
    2: {
      imageURL: "https://images-na.ssl-images-amazon.com/images/G/01/img15/pet-products/small-tiles/23695_pets_vertical_store_dogs_small_tile_8._CB312176604_.jpg",
      name: "Dogwoman",
      description: "Particle Physicist"
    }
  }
};

export default (state=initialState, {type, payload})=>{
  let toReturn;
  switch (type) {
    case "SET_NEW_STATEMENT_TEXT":
      return assign(state, {
        debates: assign(state.debates, {
          [payload.debateID]: assign(state.debates[payload.debateID], {
            newStatementText: payload.text
          })
        })
      });
      // break;
    case "SUBMIT_NEW_STATEMENT":
      const statementIDsKey = state.debates[payload].openingStatementIDs.length < 2 
        ? "openingStatementIDs" 
        : "rebuttalIDs";
      const newStatementID = Math.max.apply(Math, state.debates[payload][statementIDsKey].concat([0])) + 1; // TODO
      const output = assign(state, {
        debates: assign(state.debates, {
          [payload]: assign(state.debates[payload], {
            newStatementText: "",
            [statementIDsKey]: [...state.debates[payload][statementIDsKey], newStatementID]
          })
        }),
        statements: assign(state.statements, {
          [newStatementID]: {
            text: state.debates[payload].newStatementText,
            date: new Date().getTime()
          }
        }),
        activeUserID: state.activeUserID === 1 ? 2 : 1
      });
      return output;
      // break;
    default:
      return state;
      // break;
  }
};

