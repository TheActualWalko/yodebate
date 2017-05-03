import {Map, List} from "immutable";
import {createSelector} from "reselect";
import {getActiveAuthorID} from "./author-selectors";

export const getDebates = state => state.get("debates", Map());
export const getActiveDebateID = createSelector(
  getDebates,
  debates => debates.get("activeDebateID", null)
);

export const getActiveDebate = createSelector(
  [getDebates, getActiveDebateID],
  (debates, debateID) => debates.getIn(["byID", debateID], null)
);

const makeDebateGetter = (key, def = null) => createSelector(
  getActiveDebate,
  debate => debate ? debate.get(key, def) : def
);

export const getIsOver = makeDebateGetter("isOver", false);
export const getInitiatorID = makeDebateGetter("initiatorID", null);
export const getResponderID = makeDebateGetter("responderID", null);
export const getNewStatementText = makeDebateGetter("newStatementText", "");
export const getPositionStatements = makeDebateGetter("positionStatements", Map({
  initiator: "",
  responder: ""
}));
export const getStatementIDs = makeDebateGetter("statementIDs", List());
export const getIsLoading = makeDebateGetter("isLoading", false);
export const getIsLoaded = makeDebateGetter("isLoaded", false);
export const getError = makeDebateGetter("error", null);

export const getHaveAllOpeningStatements = createSelector(
  getStatementIDs,
  statementIDs => statementIDs.size >= 2
);

export const getInitiatorPositionStatement = createSelector(
  getPositionStatements,
  statements => statements.get('initiator')
);

export const getResponderPositionStatement = createSelector(
  getPositionStatements,
  statements => statements.get('responder')
);

export const getActiveAuthorIsInitiator = createSelector(
  [getActiveAuthorID, getInitiatorID],
  (activeAuthorID, initiatorID) => activeAuthorID !== null && activeAuthorID === initiatorID
);

export const getActiveAuthorIsResponder = createSelector(
  [getActiveAuthorID, getResponderID],
  (activeAuthorID, responderID) => activeAuthorID !== null && activeAuthorID === responderID
);

export const getNeedPositionStatement = createSelector(
  [
    getInitiatorPositionStatement,
    getResponderPositionStatement,
    getActiveAuthorIsInitiator,
    getActiveAuthorIsResponder
  ],
  (initiatorStatement, responderStatement, isInitiator, isResponder) => {
    if (isInitiator) {
      return !initiatorStatement;
    } else if (isResponder) {
      return !responderStatement;
    } else {
      return false;
    }
  }
);

export const getIsActiveAuthorTurn = createSelector(
  [
    getIsOver, 
    getStatementIDs,
    getActiveAuthorIsInitiator,
    getActiveAuthorIsResponder
  ],
  (isOver, allStatementIDs, isInitiator, isResponder) => {
    if (isOver) {
      return false;
    } else {
      if (allStatementIDs.size % 2 === 0) {
        return isInitiator;
      } else {
        return isResponder
      }
    }
  }
);

export const getNeedOpeningStatement = createSelector(
  [
    getStatementIDs,
    getActiveAuthorIsInitiator,
    getActiveAuthorIsResponder
  ],
  (openingStatementIDs, isInitiator, isResponder) => {
    if (isInitiator) {
      return openingStatementIDs.size === 0;
    } else if (isResponder) {
      return openingStatementIDs.size === 1;
    } else {
      return false;
    }
  }
);