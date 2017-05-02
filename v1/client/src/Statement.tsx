import React = require("react");
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import StatementContent from "./StatementContent";
import Author from "./Author";
import {getAuthorID, getIsInitiatorStatement, getIsResponderStatement} from "./statement-selectors";

const mapStateToProps = createStructuredSelector({
  authorID: getAuthorID,
  isInitiatorStatement: getIsInitiatorStatement,
  isResponderStatement: getIsResponderStatement
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

export default connect(mapStateToProps)(Statement) as React.ComponentClass<{statementID: any}>;