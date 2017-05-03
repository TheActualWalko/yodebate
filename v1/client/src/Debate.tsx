import React = require("react");
import Annotation from "./Annotation";
import Statement from "./Statement";
import NewStatement from "./NewStatement";
import PositionStatements from "./PositionStatements";
import {rebuttalCharLimit, openingStatementCharLimit} from "./limits";
import {connect} from "react-redux";
import {List} from "immutable";
import {createStructuredSelector} from "reselect";
import {getActiveDebate} from "./debate-actions";
import loader from "./loader";
import {
  getIsLoaded,
  getIsLoading,
  getError,
  getInitiatorPositionStatement,
  getResponderPositionStatement,
  getIsActiveAuthorTurn, 
  getNeedPositionStatement, 
  getNeedOpeningStatement,
  getHaveAllOpeningStatements,
  getStatementIDs
} from "./debate-selectors"

const mapStateToProps = createStructuredSelector({
  isLoaded: getIsLoaded,
  isLoading: getIsLoading,
  isMyTurn: getIsActiveAuthorTurn,
  needPositionStatement: getNeedPositionStatement,
  needOpeningStatement: getNeedOpeningStatement,
  haveAllOpeningStatements: getHaveAllOpeningStatements,
  statementIDs: getStatementIDs,
  error: getError
});

const mapDispatchToProps = (dispatch) => ({
  load: ()=>dispatch(getActiveDebate())
});

const renderPositionStatements = ({id})=>{
  return <PositionStatements />;
}

const renderOpeningStatementsAnnotation = ({needPositionStatement})=>{
  return !needPositionStatement 
    ? <Annotation title="Opening Statements" subtitle="500 characters each" />
    : null;
}

const renderOpeningStatements = ({needPositionStatement, needOpeningStatement, id, statementIDs})=>{
  if (needPositionStatement) {
    return null;
  } else if (needOpeningStatement) {
    return <NewStatement isRebuttal={false} /> 
  } else { 
    return statementIDs
      .slice(0,2)
      .map(statementID => <Statement statementID={statementID} key={statementID} />);
  }
}

const renderRebuttalsAnnotation = ({statementIDs, isMyTurn})=>{
  console.log(statementIDs, statementIDs.size, isMyTurn);
  return (statementIDs.size >= 3 || (statementIDs.size === 2 && isMyTurn))
    ? <Annotation title="Rebuttals" subtitle="250 characters each" />
    : null;
}

const renderRebuttals = ({haveAllOpeningStatements, statementIDs, id})=>{
  return haveAllOpeningStatements
    ? statementIDs
      .slice(2)
      .map(statementID => <Statement statementID={statementID} key={statementID} />) 
    : null;
}

const renderNewRebuttalOrFinalAnnotation = ({haveAllOpeningStatements, isMyTurn, id})=>{
  if (haveAllOpeningStatements) {
    return isMyTurn
      ? <NewStatement isRebuttal={true} />
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

export default connect(mapStateToProps, mapDispatchToProps)(loader(Debate));