import {Map, List, fromJS} from "immutable";
import {combineReducers} from "redux-immutable";
import authors from "./author-reducer";
import debates from "./debate-reducer";
import statements from "./statement-reducer";
import notification from "./notification-reducer";
import {routerReducer} from "react-router-redux";

export default combineReducers({
  authors,
  statements,
  debates,
  notification,
  routing: routerReducer
});

