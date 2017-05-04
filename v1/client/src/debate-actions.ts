import api from "./api";
import {getNewStatementText, getInitiatorPositionStatement} from "./debate-selectors";
import {getStatement, receiveStatement} from "./statement-actions";
import {push} from "react-router-redux";

export const receiveDebate = ({ debateID, debate })=>({
  type: "RECEIVE_DEBATE",
  payload: { debateID, debate }
});

export const debateError = ({ debateID, error })=>({
  type: "DEBATE_ERROR",
  payload: { debateID, error }
});

export const getDebate = (debateID) => {
  return (dispatch, getState) => {
    dispatch({
      type: "REQUEST_DEBATE",
      payload: { debateID }
    });
    api("getDebate", { debateID })
      .then((debate)=>{
        if (!debate.responderID) {
          return api("joinDebate", {debateID})
        } else {
          return debate;
        }
      })
      .then((debate)=>dispatch(receiveDebate({ debateID, debate })))
      .catch((error)=>dispatch(debateError({ debateID, error })));
  }
}

export const submitPositionStatement = (debateID) => {
  return (dispatch, getState) => {
    if (debateID === "new") {
      dispatch({ type: "SET_NEW_DEBATE_POSITION_STATEMENT" });
    } else {
      const positionStatement = {
        debateID,
        text: getNewStatementText(getState(), {debateID})
      };
      api("setPositionStatement", positionStatement)
        .then((debate)=>dispatch(receiveDebate({ debateID, debate })))
        .catch((error)=>dispatch(debateError({ debateID, error })));
    }
  }
}

export const submitNewStatement = (debateID) => {
  return (dispatch, getState) => {
    const state = getState();
    if (debateID === "new") {
      api(
        "startDebate", 
        {
          positionStatementText: getInitiatorPositionStatement(state, {debateID}),
          openingStatementText: getNewStatementText(state, {debateID})
        }
      ).then(
      ({statementID, statement, debateID, debate})=>{
          dispatch(receiveStatement({ statementID, statement }));
          dispatch(receiveDebate({ debateID, debate }));
          dispatch(push("/" + debateID));
        }
      ).catch(
        (error)=>dispatch(debateError({ debateID: "new", error }))
      );
    } else {
      const payload = {
        debateID, 
        text: getNewStatementText(state, {debateID})
      };
      api(
        "addStatement", 
        payload
      ).then(
        ({statementID, statement, debate})=>{
          dispatch(receiveStatement({ statementID, statement }));
          dispatch(receiveDebate({ debateID, debate }));
        }
      ).catch(
        (error)=>dispatch(debateError({ debateID: payload.debateID, error }))
      );
    }
  }
}

export const setNewStatementText = ({debateID, text}) => {
  return {
    type: "SET_NEW_STATEMENT_TEXT",
    payload: { debateID, text }
  }
}