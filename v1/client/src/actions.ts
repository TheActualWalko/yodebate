export const setNewStatementText = (debateID, text) => {
  return {
    type: "SET_NEW_STATEMENT_TEXT",
    payload: {text, debateID}
  }
}

export const submitPositionStatement = (debateID) => {
  return {
    type: "SUBMIT_POSITION_STATEMENT",
    payload: debateID
  }
}

export const submitNewStatement = (debateID) => {
  return {
    type: "SUBMIT_NEW_STATEMENT",
    payload: debateID
  }
}