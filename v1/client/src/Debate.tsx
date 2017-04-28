import React = require("react");
import Annotation from "./Annotation";
import Statement from "./Statement";
import NewStatement from "./NewStatement";
import {rebuttalCharLimit, openingStatementCharLimit} from './limits';
import {connect} from "react-redux";

const mapStateToProps = (state, {id})=>{
  const currentDebate = state.debates[id];
  if (!currentDebate) {
    return {
      myTurn: false,
      needPositionStatement: false,
      needOpeningStatement: false,
      openingStatementIDs: [],
      haveAllOpeningStatements: false,
      rebuttalIDs: []
    }
  }
  const {activeUserID} = state;
  const {
    rebuttalIDs, 
    openingStatementIDs, 
    initiatorID, 
    responderID, 
    isOver,
    positionStatements
  } = currentDebate;
  const allStatementIDs = [...openingStatementIDs, ...rebuttalIDs];
  const isInitiator = activeUserID === initiatorID;
  const isResponder = activeUserID === responderID;
  let myTurn = false;
  if (
    !isOver
    &&
    (
      (isInitiator && (allStatementIDs.length % 2) === 0)
      ||
      (isResponder && (allStatementIDs.length % 2) === 1)
    )
  ) {
    myTurn = true;
  }

  const needPositionStatement = !(
    (isInitiator && !!positionStatements.initiator)
    ||
    (isResponder && !!positionStatements.responder)
  );

  const haveAllOpeningStatements = openingStatementIDs.length === 2;

  const needOpeningStatement = !(
    (isInitiator && openingStatementIDs.length >= 1)
    ||
    (isResponder && haveAllOpeningStatements)
  );

  return {
    myTurn,
    needPositionStatement,
    needOpeningStatement,
    openingStatementIDs,
    haveAllOpeningStatements,
    rebuttalIDs
  };
};

const Debate = ({
  id,
  myTurn,
  needPositionStatement,
  needOpeningStatement,
  haveAllOpeningStatements,
  openingStatementIDs,
  rebuttalIDs
})=>(
  <div className="debate">
    { 
      !needPositionStatement
      && 
      <Annotation 
        title="Opening Statements" 
        subtitle="500 characters each" 
      /> 
    }
    { 
      needOpeningStatement
      && 
      <NewStatement debateID={id} isRebuttal={false} /> 
      ||
      openingStatementIDs.map(statement => <Statement debateID={id} id={statement} />)
    }
    { 
      haveAllOpeningStatements
      &&
      <Annotation 
        title="Rebuttals" 
        subtitle="250 characters each" 
      /> 
    }
    { 
      haveAllOpeningStatements
      &&
      rebuttalIDs.map(statement => <Statement debateID={id} id={statement} />) 
    }
    { 
      (myTurn && haveAllOpeningStatements)
      && 
      <NewStatement debateID={id} isRebuttal={true} /> 
      ||
      (haveAllOpeningStatements && <Annotation 
        title="That's all right now" 
        subtitle="We'll notify you when your opponent responds" 
      />)
    }
  </div>
);

export default connect(mapStateToProps)(Debate);