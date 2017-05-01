const app  = require("express")();
const http = require("http").Server(app);
const io   = require("socket.io")(http);

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
const charsLength = chars.length;

const randomID = ()=>{
  let output = "";
  for(let i = 0; i < 10; i++){
    output += chars[Math.floor(Math.random() * charsLength)];
  }
  return output;
}

const authors = {
  sam: {
    imageURL: "sam.png",
    name: "Sam Watkinson",
    description: "Morality Engineer"
  },
  marc: {
    imageURL: "marc.png",
    name: "Marc Burns",
    description: "Hedge Fund Roboticist"
  }
}

const debates = {
  test: {
    initiatorID: "sam",
    responderID: "marc",
    positionStatements: {
      initiator: null,
      responder: null
    },
    openingStatementIDs: [],
    rebuttalIDs: [],
    isOver: false
  }
};
const statements = {};

const getPosition = (debateID, activeAuthorID) => {
  if (debates[debateID].initiatorID === activeAuthorID) {
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
  socket.on("authenticate", (authorID)=>{
    if (!activeAuthorID) {
      activeAuthorID = authorID;
    } 
  });
  socket.on("getDebate", (debateID, callback)=>{
    const debate = debates[debateID];
    const debateStatements = {};
    debate.openingStatementIDs.forEach( id => debateStatements[id] = statements[id] );
    debate.rebuttalIDs.forEach( id => debateStatements[id] = statements[id] );
    callback(
      debate, 
      {
        [debate.initiatorID]: authors[debate.initiatorID],
        [debate.responderID]: authors[debate.responderID]
      },
      debateStatements
    );
  });
  socket.on("getAuthor", (authorID, callback)=>{
    callback(authors[authorID]);
  });
  socket.on("joinDebate", (debateID, callback)=>{
    if (!debates[debateID].responderID) {
      debates[debateID].responderID = activeAuthorID;
    }
    callback(debates[debateID]);
  });
  socket.on("startDebate", (callback)=>{
    const debateID = randomID();
    debates[debateID] = {
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
    callback(debateID);
  });
  socket.on("setPositionStatement", (debateID, statementText, callback)=>{
    const position = getPosition(debateID, activeAuthorID);
    console.log(position, debateID, activeAuthorID);
    if (position) {
      debates[debateID].positionStatements[position] = statementText;
      console.log(debates[debateID]);
    }
    callback();
  });
  socket.on("addStatement", (debateID, statementText, callback)=>{
    let statementID;
    if (getIsMyTurn(debateID, activeAuthorID)) {
      statementID = randomID();
      statements[statementID] = {
        debateID,
        authorID: activeAuthorID,
        text: statementText,
        date: new Date().getTime()
      };
      if (debates[debateID].openingStatementIDs.length < 2){
        debates[debateID].openingStatementIDs.push(statementID);
      } else {
        debates[debateID].rebuttalIDs.push(statementID);
      }
      console.log(debates[debateID]);
    };
    callback(statementID, statements[statementID]);
  });
});

http.listen(3003, ()=>{
  console.log("listening on *:3003");
});