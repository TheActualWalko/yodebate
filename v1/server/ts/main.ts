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
      initiator: "Initiator",
      responder: "Responder"
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

  const register = (endpoint, handler)=>{
    socket.on(endpoint, (payload, callback)=>{
      console.log(activeAuthorID, "called", endpoint, JSON.stringify(payload).slice(0,50));
      const reject = error => callback(error);
      const resolve = response => callback(null, response);
      handler(payload, resolve, reject);
    });
  }

  let activeAuthorID;
  register("authenticate", ({ authorID }, resolve)=>{
    activeAuthorID = authorID;
    resolve(authors[authorID]);
  });
  register("getDebate", ({ debateID }, resolve, reject)=>{
    const debate = debates[debateID];
    debate ? resolve(debate) : reject("No debate found with id " + debateID);
  });
  register("getStatement", ({ statementID }, resolve, reject)=>{
    const statement = statements[statementID];
    statement ? resolve(statement) : reject("No statement found with id " + statementID);
  });
  register("getAuthor", ({ authorID }, resolve, reject)=>{
    const author = authors[authorID];
    author ? resolve(author) : reject("No author found with id " + authorID);
  });
  register("joinDebate", ({ debateID }, resolve, reject)=>{
    if (!debates[debateID].responderID) {
      debates[debateID].responderID = activeAuthorID;
      resolve(debates[debateID]);
    } else {
      reject("This debate is full!");
    }
  });
  register("startDebate", ({}, resolve, reject)=>{
    const debateID = randomID();
    const debate = {
      initiatorID: activeAuthorID,
      responderID: null,
      positionStatements: {
        initiator: null,
        responder: null
      },
      statementIDs: [],
      isOver: false
    };
    debates[debateID] = debate;
    resolve({debate, debateID});
  });
  register("setPositionStatement", ({ debateID, text }, resolve, reject)=>{
    const position = getPosition(debateID, activeAuthorID);
    if (position) {
      debates[debateID].positionStatements[position] = text;
      resolve(debates[debateID]);
    } else {
      reject("You're not allowed to set a position statement now!");
    }
  });
  register("addStatement", ({ debateID, text }, resolve, reject)=>{
    if (getIsMyTurn(debateID, activeAuthorID)) {
      const statementID = randomID();
      const statement = {
        debateID,
        text,
        authorID: activeAuthorID,
        date: new Date().getTime()
      };
      statements[statementID] = statement;
      const debate = debates[debateID];
      debate.statementIDs.push(statementID);
      resolve({statementID, statement, debate});
    } else {
      reject("It's not your turn!");
    }
  });
});

http.listen(3003, ()=>{
  console.log("listening on *:3003");
});