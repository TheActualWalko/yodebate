import api from "./api";
import {createStructuredSelector} from "reselect";
import {getActiveDebateID, getNewStatementText} from "./debate-selectors";
import {receiveStatement} from "./statement-actions";

export const receiveDebate = ({ debateID, debate })=>({
  type: "RECEIVE_DEBATE",
  payload: { debateID, debate }
});

export const debateError = ({ debateID, error })=>({
  type: "DEBATE_ERROR",
  payload: { debateID, error }
});

export const getActiveDebate = () => {
  return (dispatch, getState) => {
    const debateID = getActiveDebateID(getState());
    dispatch({
      type: "REQUEST_DEBATE",
      payload: { debateID }
    });
    api("getDebate", { debateID })
      .then((debate)=>dispatch(receiveDebate({ debateID, debate })))
      .catch((error)=>dispatch(debateError({ debateID, error })));
  }
}

export const submitPositionStatement = () => {
  return (dispatch, getState) => {
    const positionStatement = createStructuredSelector({
      debateID: getActiveDebateID,
      text: getNewStatementText
    })(getState());
    const {debateID} = positionStatement;
    api("setPositionStatement", positionStatement)
      .then((debate)=>dispatch(receiveDebate({ debateID, debate })))
      .catch((error)=>dispatch(debateError({ debateID, error })));
  }
}

export const submitNewStatement = () => {
  return (dispatch, getState) => {
    const payload = createStructuredSelector({
      debateID: getActiveDebateID, 
      text: getNewStatementText 
    })(getState());
    api(
      "addStatement", 
      payload
    ).then(
      ({statementID, statement, debate})=>{
        const {debateID} = statement;
        dispatch(receiveStatement({ statementID, statement }));
        dispatch(receiveDebate({ debateID, debate }));
      }
    ).catch(
      (error)=>dispatch(debateError({ debateID: payload.debateID, error }))
    );
  }
}

export const setNewStatementText = (text) => {
  return {
    type: "SET_NEW_STATEMENT_TEXT",
    payload: { text }
  }
}