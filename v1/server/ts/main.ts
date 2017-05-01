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
    statementIDs: [],
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
  const numStatements = debate.statementIDs.length;
  return (numStatements % 2) === (position === "initiator" ? 0 : 1);
}

io.on("connection", (socket)=>{
  let activeAuthorID;
  socket.on("authenticate", (authorID)=>{
    console.log(activeAuthorID, "called", "authenticate");
    if (!activeAuthorID) {
      activeAuthorID = authorID;
    } 
  });
  socket.on("getDebate", (debateID, callback)=>{
    console.log(activeAuthorID, "called", "getDebate");
    const debate = debates[debateID];
    const debateStatements = {};
    debate.statementIDs.forEach( id => debateStatements[id] = statements[id] );
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
    console.log(activeAuthorID, "called", "getAuthor");
    callback(authors[authorID]);
  });
  socket.on("joinDebate", (debateID, callback)=>{
    console.log(activeAuthorID, "called", "joinDebate");
    if (!debates[debateID].responderID) {
      debates[debateID].responderID = activeAuthorID;
    }
    callback(debates[debateID]);
  });
  socket.on("startDebate", (callback)=>{
    console.log(activeAuthorID, "called", "startDebate");
    const debateID = randomID();
    debates[debateID] = {
      initiatorID: activeAuthorID,
      responderID: null,
      positionStatements: {
        initiator: null,
        responder: null
      },
      statementIDs: [],
      isOver: false
    }
    callback(debateID);
  });
  socket.on("setPositionStatement", (debateID, statementText, callback)=>{
    console.log(activeAuthorID, "called", "setPositionStatement");
    const position = getPosition(debateID, activeAuthorID);
    if (position) {
      debates[debateID].positionStatements[position] = statementText;
    }
    callback();
  });
  socket.on("addStatement", (debateID, statementText, callback)=>{
    console.log(activeAuthorID, "called", "addStatement");
    let statementID;
    if (getIsMyTurn(debateID, activeAuthorID)) {
      statementID = randomID();
      statements[statementID] = {
        debateID,
        authorID: activeAuthorID,
        text: statementText,
        date: new Date().getTime()
      };
      debates[debateID].statementIDs.push(statementID);
    };
    callback(statementID, statements[statementID]);
  });
});

http.listen(3003, ()=>{
  console.log("listening on *:3003");
});