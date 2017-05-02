import React = require("react");
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {getText, getDate, getPermalink} from "./statement-selectors";

const mapStateToProps = createStructuredSelector({
  text: getText,
  date: getDate,
  permalink: getPermalink
});

const StatementContent = ({statementID, text, date, permalink})=>(
  <div className="statement-content">
    <div className="statement-text">
      <main>
        <p>{text}</p>
      </main>
      <footer>
        <a href={permalink}>Permalink</a>
        <time>{new Date(date).toDateString()}</time>
      </footer>
    </div>
  </div>
);

export default connect(mapStateToProps)(StatementContent) as React.ComponentClass<{statementID: any}>;