import React = require("react");
import Annotation from "./Annotation";
import Statement from "./Statement";
import NewStatement from "./NewStatement";
import PositionStatements from "./PositionStatements";
import {rebuttalCharLimit, openingStatementCharLimit} from "./limits";
import {connect} from "react-redux";
import {List} from "immutable";
import {createStructuredSelector} from "reselect";
import {getActiveDebate} from "./actions";
import {
  getIsLoaded,
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
  isMyTurn: getIsActiveAuthorTurn,
  needPositionStatement: getNeedPositionStatement,
  needOpeningStatement: getNeedOpeningStatement,
  haveAllOpeningStatements: getHaveAllOpeningStatements,
  statementIDs: getStatementIDs
});

const mapDispatchToProps = (dispatch) => ({
  load: ()=>dispatch(getActiveDebate())
});

const renderPositionStatements = ({id})=>{
  return <PositionStatements />;
}

const renderOpeningStatementsAnnotation = ({needPositionStatement})=>{
  return !needPositionStatement 
    && <Annotation title="Opening Statements" subtitle="500 characters each" />;
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
  return statementIDs.size >= 3 || (statementIDs.size === 2 && isMyTurn)
    && <Annotation title="Rebuttals" subtitle="250 characters each" />;
}

const renderRebuttals = ({haveAllOpeningStatements, statementIDs, id})=>{
  return haveAllOpeningStatements
    && statementIDs
      .slice(2)
      .map(statementID => <Statement statementID={statementID} key={statementID} />) 
}

const renderNewRebuttalOrFinalAnnotation = ({haveAllOpeningStatements, isMyTurn, id})=>{
  if (haveAllOpeningStatements) {
    return isMyTurn
      ? <NewStatement isRebuttal={true} />
      : <Annotation title="That's all right now" subtitle="We'll notify you when your opponent responds" />;
  }
}

class Debate extends React.Component<any, any>{
  componentDidMount() {
    if (!this.props.isLoaded) {
      this.props.load();
    }
  }
  render() {
    console.log("rendering");
    return this.props.isLoaded 
      ? (
        <div className="debate">
          { renderPositionStatements(this.props) }
          { renderOpeningStatementsAnnotation(this.props) }
          { renderOpeningStatements(this.props) }
          { renderRebuttalsAnnotation(this.props) }
          { renderRebuttals(this.props) }
          { renderNewRebuttalOrFinalAnnotation(this.props) }
        </div>
      )
      : null
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Debate);