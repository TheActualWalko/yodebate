import React = require("react");
import Annotation from "./Annotation";
import Statement from "./Statement";
import NewStatement from "./NewStatement";
import {rebuttalCharLimit, openingStatementCharLimit} from "./limits";
import {connect} from "react-redux";
import {List} from "immutable";
import {createStructuredSelector} from "reselect";
import {
  getIsActiveUserTurn, 
  getNeedPositionStatement, 
  getNeedOpeningStatement,
  getHaveAllOpeningStatements,
  getOpeningStatementIDs,
  getRebuttalIDs,
  getDebate
} from "./selectors"

const mapStateToProps = (state, {id}) => createStructuredSelector({
  isMyTurn: getIsActiveUserTurn(id),
  needPositionStatement: getNeedPositionStatement(id),
  needOpeningStatement: getNeedOpeningStatement(id),
  haveAllOpeningStatements: getHaveAllOpeningStatements(id),
  openingStatementIDs: getOpeningStatementIDs(id),
  rebuttalIDs: getRebuttalIDs(id)
})(state);

const getOpeningStatementsAnnotation = ({needPositionStatement})=>{
  return !needPositionStatement 
    && <Annotation title="Opening Statements" subtitle="500 characters each" />;
}

const getOpeningStatements = ({needOpeningStatement, id, openingStatementIDs})=>{
  return needOpeningStatement
    && <NewStatement debateID={id} isRebuttal={false} /> 
    || openingStatementIDs.map(statementID => <Statement debateID={id} id={statementID} key={statementID} />);
}

const getRebuttalsAnnotation = ({haveAllOpeningStatements})=>{
  return haveAllOpeningStatements
    && <Annotation title="Rebuttals" subtitle="250 characters each" />;
}

const getRebuttals = ({haveAllOpeningStatements, rebuttalIDs, id})=>{
  return haveAllOpeningStatements
    && rebuttalIDs.map(statementID => <Statement debateID={id} id={statementID} key={statementID} />) 
}

const getNewRebuttalOrFinalAnnotation = ({haveAllOpeningStatements, isMyTurn, id})=>{
  if (haveAllOpeningStatements) {
    return isMyTurn
      ? <NewStatement debateID={id} isRebuttal={true} />
      : <Annotation title="That's all right now" subtitle="We'll notify you when your opponent responds" />;
  }
}

const Debate = (props)=>(
  <div className="debate">
    { getOpeningStatementsAnnotation(props) }
    { getOpeningStatements(props) }
    { getRebuttalsAnnotation(props) }
    { getRebuttals(props) }
    { getNewRebuttalOrFinalAnnotation(props) }
  </div>
);

export default connect(mapStateToProps)(Debate);