import React = require("react");
import Annotation from "./Annotation";
import LinkAnnotation from "./LinkAnnotation";
import Statement from "./Statement";
import NewStatement from "./NewStatement";
import PositionStatements from "./PositionStatements";
import {rebuttalCharLimit, openingStatementCharLimit} from "./limits";
import {connect} from "react-redux";
import {List} from "immutable";
import {createStructuredSelector} from "reselect";
import {getDebate} from "./debate-actions";
import loader from "./loader";
import {
  getIsLoaded,
  getIsLoading,
  getError,
  getResponderID,
  getInitiatorPositionStatement,
  getResponderPositionStatement,
  getIsActiveAuthorTurn, 
  getNeedPositionStatement, 
  getNeedOpeningStatement,
  getHaveAllOpeningStatements,
  getStatementIDs
} from "./debate-selectors"
import { getIsLoggedIn } from "./author-selectors";

const mapStateToProps = createStructuredSelector({
  responderID: getResponderID,
  isLoggedIn: getIsLoggedIn,
  isLoaded: getIsLoaded,
  isLoading: getIsLoading,
  isMyTurn: getIsActiveAuthorTurn,
  needPositionStatement: getNeedPositionStatement,
  needOpeningStatement: getNeedOpeningStatement,
  haveAllOpeningStatements: getHaveAllOpeningStatements,
  statementIDs: getStatementIDs,
  error: getError
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  load: ()=>dispatch(getDebate(ownProps.debateID))
});

const renderPositionStatements = ({debateID})=>{
  return <PositionStatements debateID={debateID}/>;
}

const renderOpeningStatementsAnnotation = ({needPositionStatement, haveAllOpeningStatements})=>{
  if (!needPositionStatement && haveAllOpeningStatements) {
    return <Annotation title="Opening Statements" subtitle="500 characters each" />
  } else {
    return null;
  }
}

const renderOpeningStatements = ({needPositionStatement, needOpeningStatement, debateID, statementIDs})=>{
  if (needPositionStatement) {
    return null;
  } else if (needOpeningStatement) {
    return <NewStatement isRebuttal={false} debateID={debateID} /> 
  } else { 
    return statementIDs
      .slice(0,2)
      .map(statementID => <Statement statementID={statementID} key={statementID} />);
  }
}

const renderRebuttalsAnnotation = ({statementIDs, isMyTurn})=>{
  return (statementIDs.size >= 3 || (statementIDs.size === 2 && isMyTurn))
    ? <Annotation title="Rebuttals" subtitle="250 characters each" />
    : null;
}

const renderRebuttals = ({haveAllOpeningStatements, statementIDs, debateID})=>{
  return haveAllOpeningStatements
    ? statementIDs
      .slice(2)
      .map(statementID => <Statement statementID={statementID} key={statementID} />) 
    : null;
}

const renderNewRebuttalOrFinalAnnotation = ({haveAllOpeningStatements, needPositionStatement, isMyTurn, debateID, responderID})=>{
  if (haveAllOpeningStatements && isMyTurn) {
    return <NewStatement isRebuttal={true} debateID={debateID}/>
  } else if (!needPositionStatement && !isMyTurn) {
    if (!!responderID) {
      return <Annotation title="That's all right now" subtitle="We'll notify you when your opponent responds" />;
    } else {
      return <LinkAnnotation subtitle="Send this link to your opponent to invite them!" />;
    }
  }
}

const newify = (DebateView) => {
  return (props) => {
    const propsWithNew = {...props, debateID: "new"};
    return <DebateView {...propsWithNew} />
  }
}

const Debate = (props)=>(
  <div>
    <div className="initiator-background"></div>
    <div className="responder-background"></div>
    { props.isLoggedIn && <div className="debate">
      { renderPositionStatements(props) }
      { renderOpeningStatementsAnnotation(props) }
      { renderOpeningStatements(props) }
      { renderRebuttalsAnnotation(props) }
      { renderRebuttals(props) }
      { renderNewRebuttalOrFinalAnnotation(props) }
    </div> }
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(loader(Debate));
export const NewDebate = newify(connect(mapStateToProps, mapDispatchToProps)(Debate));