import React = require("react");
import Annotation from "./Annotation";
import Statement from "./Statement";
import NewStatement from "./NewStatement";
import PositionStatements from "./PositionStatements";
import {rebuttalCharLimit, openingStatementCharLimit} from "./limits";
import {connect} from "react-redux";
import {List} from "immutable";
import {createStructuredSelector} from "reselect";
import {
  getInitiatorPositionStatement,
  getResponderPositionStatement,
  getIsActiveUserTurn, 
  getNeedPositionStatement, 
  getNeedOpeningStatement,
  getHaveAllOpeningStatements,
  getOpeningStatementIDs,
  getRebuttalIDs
} from "./selectors"

const mapStateToProps = (state, {id}) => createStructuredSelector({
  isMyTurn: getIsActiveUserTurn(id),
  needPositionStatement: getNeedPositionStatement(id),
  needOpeningStatement: getNeedOpeningStatement(id),
  haveAllOpeningStatements: getHaveAllOpeningStatements(id),
  openingStatementIDs: getOpeningStatementIDs(id),
  rebuttalIDs: getRebuttalIDs(id)
})(state);

const renderPositionStatements = ({id})=>{
  return <PositionStatements debateID={id} />;
}

const renderOpeningStatementsAnnotation = ({needPositionStatement})=>{
  return !needPositionStatement 
    && <Annotation title="Opening Statements" subtitle="500 characters each" />;
}

const renderOpeningStatements = ({needOpeningStatement, id, openingStatementIDs})=>{
  return needOpeningStatement
    && <NewStatement debateID={id} isRebuttal={false} /> 
    || openingStatementIDs.map(statementID => <Statement debateID={id} id={statementID} key={statementID} />);
}

const renderRebuttalsAnnotation = ({haveAllOpeningStatements})=>{
  return haveAllOpeningStatements
    && <Annotation title="Rebuttals" subtitle="250 characters each" />;
}

const renderRebuttals = ({haveAllOpeningStatements, rebuttalIDs, id})=>{
  return haveAllOpeningStatements
    && rebuttalIDs.map(statementID => <Statement debateID={id} id={statementID} key={statementID} />) 
}

const renderNewRebuttalOrFinalAnnotation = ({haveAllOpeningStatements, isMyTurn, id})=>{
  if (haveAllOpeningStatements) {
    return isMyTurn
      ? <NewStatement debateID={id} isRebuttal={true} />
      : <Annotation title="That's all right now" subtitle="We'll notify you when your opponent responds" />;
  }
}

const Debate = (props)=>(
  <div className="debate">
    { renderPositionStatements(props) }
    { renderOpeningStatementsAnnotation(props) }
    { renderOpeningStatements(props) }
    { renderRebuttalsAnnotation(props) }
    { renderRebuttals(props) }
    { renderNewRebuttalOrFinalAnnotation(props) }
  </div>
);

export default connect(mapStateToProps)(Debate);