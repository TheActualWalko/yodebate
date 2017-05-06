import React = require("react");
import {connect} from "react-redux";

const mapStateToProps = (state) => ({
  link: "yodebate.me" + state.get("routing").locationBeforeTransitions.pathname
});

const LinkAnnotation = ({link, subtitle})=>(
  <div className="annotation-wrap">
    <div className="annotation">
      <h4><a>{link}</a></h4>
      <h5>{subtitle}</h5>
    </div>
  </div>
);

export default connect(mapStateToProps)(LinkAnnotation) as React.ComponentClass<{subtitle: string}>;