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
          .getIn(["byID", payload.statementID], Map())
          .merge(Map({ 
            isLoading: false,
            isLoaded: false,
            error: payload.error
          }))
      );
    case "REQUEST_STATEMENT":
      return state.setIn(
        ["byID", payload.statementID], 
        state
          .getIn(["byID", payload.statementID], Map())
          .merge(Map({ 
            isLoading: true,
            isLoaded: false,
            error: null
          }))
      );
    case "RECEIVE_STATEMENT":
      return state.setIn(
        ["byID", payload.statementID], 
        state
          .getIn(["byID", payload.statementID], Map())
          .merge(fromJS(payload.statement))
          .merge(Map({ 
            isLoading: false,
            isLoaded: true,
            error: null
          }))
      );
    default:
      return state;
  }
};