import React = require("react");
import Debate from "./Debate";
import { Provider } from "react-redux";
import store from "./store";

export default class App extends React.Component<{},{}>{
  render() {
    return (
      <Provider store={store}>
        <div>
          <div className="initiator-background"></div>
          <div className="responder-background"></div>
          {/*<Positions />*/}
          <Debate id={1} />
        </div>
      </Provider>
    );
  }
}
