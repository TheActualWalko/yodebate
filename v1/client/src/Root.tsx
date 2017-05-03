import React = require("react");
import Debate from "./Debate";
import Notification from "./Notification";
import { Provider } from "react-redux";
import store from "./store";

export default ()=>(
  <Provider store={store}>
    <div>
      <div className="initiator-background"></div>
      <div className="responder-background"></div>
      <Notification />
      <Debate />
    </div>
  </Provider>
);
