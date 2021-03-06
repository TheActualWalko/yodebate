import {createStore, applyMiddleware} from "redux";
import reducer from "./reducer";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import {Map} from "immutable";

const logger = createLogger({
  collapsed: true,
  stateTransformer: x=>x.toJS()
})

export default createStore(
  reducer,
  Map(),
  applyMiddleware(thunk, logger, routerMiddleware(browserHistory))
);