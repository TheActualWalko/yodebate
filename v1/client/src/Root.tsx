import React = require("react");
import Debate, {NewDebate} from "./Debate";
import Notification from "./Notification";
import { Provider } from "react-redux";
import store from "./store";
import {Route, Router, browserHistory} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";

const history = syncHistoryWithStore(
  browserHistory, 
  store, {
    selectLocationState: state => state.get("routing")
  }
);

const NewDebatePage = ()=>(
  <div>
    <Notification />
    <NewDebate />
  </div>
);

const DebatePage = ({ params: {debateID} })=>(
  <div>
    <Notification />
    <Debate debateID={debateID} />
  </div>
);

export default ()=>(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={NewDebatePage}></Route>
      <Route path="/:debateID" component={DebatePage}></Route>
    </Router>
  </Provider>
);
