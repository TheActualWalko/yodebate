import React = require("react");
import Editor from "./Editor";

export default (props)=>(
  <div className="statement-content editable-statement-content">
    <div className="statement-text">
      <Editor {...props} />
    </div>
  </div>
);