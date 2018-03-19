import React = require("react");
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import StatementContent from "./StatementContent";
import Author from "./Author";
import {getStatement} from "./statement-actions";
import loader from "./loader";

import {
  getAuthorID, 
  getIsInitiatorStatement, 
  getIsResponderStatement, 
  getIsLoaded,
  getIsLoading,
  getError
} from "./statement-selectors";

const mapStateToProps = createStructuredSelector({
  authorID: getAuthorID,
  isInitiatorStatement: getIsInitiatorStatement,
  isResponderStatement: getIsResponderStatement,
  isLoaded: getIsLoaded,
  isLoading: getIsLoading,
  error: getError
});

const mapDispatchToProps = (dispatch, {statementID}) => ({
  load: ()=>dispatch(getStatement(statementID))
});

const Statement = ({statementID, authorID, isInitiatorStatement, isResponderStatement}) => (
  <article 
    className={`
      statement 
      ${ isInitiatorStatement && "initiator-statement" }
      ${ isResponderStatement && "responder-statement" }
    `} 
    id={statementID}
  >
    <div className="statement-content-wrap">
      <Author authorID={authorID} />
      <StatementContent statementID={statementID} />
    </div>
  </article>
);

export default connect(mapStateToProps, mapDispatchToProps)(loader(Statement)) as React.ComponentClass<{statementID: any}>;