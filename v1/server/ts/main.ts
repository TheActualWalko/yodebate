const app  = require("express")();
const http = require("http").Server(app);
const io   = require("socket.io")(http);

const authors = {
  catman: {
    imageURL: "http://www.rd.com/wp-content/uploads/sites/2/2016/04/01-cat-wants-to-tell-you-laptop.jpg",
    name: "Catman",
    description: "Rocket Scientist"
  },
  dogwoman: {
    imageURL: "https://images-na.ssl-images-amazon.com/images/G/01/img15/pet-products/small-tiles/23695_pets_vertical_store_dogs_small_tile_8._CB312176604_.jpg",
    name: "Dogwoman",
    description: "Particle Physicist"
  }
}

const debates = {};
const statements = {};

const getPosition = (debateID, activeAuthorID) => {
  if (debates[debateID].intiatorID === activeAuthorID) {
    return "initiator";
  } else if (debates[debateID].responderID === activeAuthorID) {
    return "responder";
  } else {
    return null;
  }
};

const getIsMyTurn = (debateID, activeAuthorID) => {
  const position = getPosition(debateID, activeAuthorID);
  if (!position) {
    return false
  }
  const debate = debates[debateID];
  const numStatements = [...debate.openingStatementIDs, ...debate.rebuttalIDs].length;
  return (numStatements % 2) === (position === "initiator" ? 0 : 1);
}

io.on("connection", (socket)=>{
  let activeAuthorID;
  socket.on("login", (authorID, callback)=>{
    if (!activeAuthorID) {
      activeAuthorID = authorID;
    } 
    callback(authors[activeAuthorID]);
  });
  socket.on("getDebate", (id, callback)=>{
    callback(debates[id]);
  });
  socket.on("getAuthor", (id, callback)=>{
    callback(authors[id]);
  });
  socket.on("joinDebate", (debateID, callback)=>{
    if (!debates[id].responderID) {
      debates[id].responderID = activeAuthorID;
    }
    callback(debates[id]);
  });
  socket.on("startDebate", (callback)=>{
    const id = randomID();
    debates[id] = {
      initiatorID: activeAuthorID,
      responderID: null,
      positionStatements: {
        initiator: null,
        responder: null
      },
      openingStatementIDs: [],
      rebuttalIDs: [],
      isOver: false
    }
    callback(id);
  });
  socket.on("setPositionStatement", (debateID, statementText, callback)=>{
    const position = getPosition(debateID, activeAuthorID);
    if (position) {
      debates[debateID].positionStatements[position] = statementText;
    }
    callback();
  });
  socket.on("addStatement", (debateID, statementText)=>{
    if (getIsMyTurn(debateID, activeAuthorID)) {
      const id = randomID();
      statements[id] = {
        debateID,
        authorID: activeAuthorID,
        text: statementText,
        date: new Date().getTime()
      };
      if (debates[debateID].openingStatementIDs.length < 2){
        debates[debateID].openingStatementIDs.push();
      } else {
        debates[debateID].rebuttalIDs.push();
      }
    };
    
    callback(id, statements[id]);
  });
});

http.listen(3003, ()=>{
  console.log("listening on *:3003");
});