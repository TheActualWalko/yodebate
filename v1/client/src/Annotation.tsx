import React = require("react");

export default ({title, subtitle})=>(
  <div className="annotation-wrap">
    <div className="annotation">
      <h4>{title}</h4>
      <h5>{subtitle}</h5>
    </div>
  </div>
);