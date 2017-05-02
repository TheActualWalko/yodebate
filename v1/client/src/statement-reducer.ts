import {Map, fromJS} from "immutable";
export default (
  state=Map({
    byID: Map()
  }), 
  {type, payload}
) => {
  switch (type) {
    case "STATEMENT_ERROR":
      return state.setIn(
        ["byID", payload.statementID], 
        state
          .get(payload.statementID, Map())
          .merge(Map({ 
            loading: false,
            error: payload.error
          }))
      );
    case "REQUEST_STATEMENT":
      return state.setIn(
        ["byID", payload.statementID], 
        state
          .get(payload.statementID, Map())
          .merge(Map({ 
            loading: true,
            error: null
          }))
      );
    case "RECEIVE_STATEMENT":
      return state.setIn(
        ["byID", payload.statementID], 
        state
          .get(payload.statementID, Map())
          .merge(fromJS(payload.statement))
          .merge(Map({ 
            loading: false,
            error: null
          }))
      );
    default:
      return state;
  }
};