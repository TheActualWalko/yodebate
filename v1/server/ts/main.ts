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
      initiator: "",
      responder: ""
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

const socketByAuthorID = {};

const getOtherAuthor = (debateID, activeAuthorID) => {
  const debate = debates[debateID];
  if (debate.initiatorID === activeAuthorID) {
    return debate.responderID;
  } else if (debate.responderID === activeAuthorID) {
    return debate.initiatorID;
  }
}

const uncache = (authorID, debateID) => {
  const socket = socketByAuthorID[authorID];
  if (socket) {
    socket.emit("uncache", {
      debateID, 
      debate: debates[debateID]
    });
  }
}

io.on("connection", (socket)=>{

  const register = (endpoint, handler)=>{
    socket.on(endpoint, (payload, callback)=>{
      console.log(activeAuthorID + " called " + endpoint, JSON.stringify(payload).slice(0,50));
      const reject = error => callback(error);
      const resolve = response => callback(null, response);
      handler(payload, resolve, reject);
    });
  }

  let activeAuthorID;
  register("authenticate", ({ authorID }, resolve)=>{
    delete socketByAuthorID[activeAuthorID];
    activeAuthorID = authorID;
    socketByAuthorID[authorID] = socket;
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
  register("startDebate", ({
    positionStatementText,
    openingStatementText
  }, resolve, reject)=>{
    if (!positionStatementText || !openingStatementText) {
      reject("You must supply a position and opening statement");
    } else {
      const debateID = randomID();
      const statementID = randomID();
      const statement = {
        debateID,
        text: openingStatementText,
        authorID: activeAuthorID,
        date: new Date().getTime()
      };
      const debate = {
        initiatorID: activeAuthorID,
        responderID: null,
        positionStatements: {
          initiator: positionStatementText,
          responder: null
        },
        statementIDs: [statementID],
        isOver: false
      };
      debates[debateID] = debate;
      statements[statementID] = statement;
      console.log(debate, statement);
      resolve({debate, debateID, statement, statementID});
    }
  });
  register("setPositionStatement", ({ debateID, text }, resolve, reject)=>{
    const position = getPosition(debateID, activeAuthorID);
    if (position) {
      debates[debateID].positionStatements[position] = text;
      uncache(getOtherAuthor(debateID, activeAuthorID), debateID);
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
      uncache(getOtherAuthor(debateID, activeAuthorID), debateID);
      resolve({statementID, statement, debate});
    } else {
      reject("It's not your turn!");
    }
  });
});

http.listen(3003, ()=>{
  console.log("listening on *:3003");
});