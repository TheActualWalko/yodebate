import api from "./api";

export const receiveStatement = ({ statementID, statement })=>({
  type: "RECEIVE_STATEMENT",
  payload: { statementID, statement }
});

export const statementError = ({ statementID, error })=>({
  type: "STATEMENT_ERROR",
  payload: { statementID, error }
});

export const getStatement = (statementID) => {
  return (dispatch, getState) => {
    dispatch({
      type: "REQUEST_STATEMENT",
      payload: { statementID }
    });
    api("getStatement", { statementID })
      .then((statement)=>dispatch(receiveStatement({ statementID, statement })))
      .catch((error)=>dispatch(statementError({ statementID, error })));
  }
}