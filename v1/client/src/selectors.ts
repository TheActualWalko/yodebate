import {createSelector} from "reselect";
import {List, Map} from 'immutable';

export const getDebates = state => state.get('debates', Map())
export const getActiveUserID = state => state.get('activeUserID', null);

export const getDebate = debateID => createSelector(
  getDebates,
  debates => debates.get(debateID, null)
);

const makeDebateGetter = (key, def = null) => (debateId, trueDef = def) => createSelector(
  getDebate(debateId),
  debate => debate.get(key, trueDef)
)

export const getIsOver = makeDebateGetter('isOver', false);
export const getInitiatorID = makeDebateGetter('initiatorID', null);
export const getResponderID = makeDebateGetter('responderID', null);
export const getPositionStatements = makeDebateGetter('positionStatements', Map({
  initiator: null,
  responder: null
}));
export const getOpeningStatementIDs = makeDebateGetter('openingStatementIDs', List());
export const getRebuttalIDs = makeDebateGetter('rebuttalIDs', List());

export const getHaveAllOpeningStatements = debateID => createSelector(
  getOpeningStatementIDs(debateID),
  openingStatementIDs => openingStatementIDs.size === 2
);

export const getAllStatementIDs = debateID => createSelector(
  [
    getOpeningStatementIDs(debateID),
    getRebuttalIDs(debateID)
  ],
  (openingStatementIDs, rebuttalIDs) => 
    openingStatementIDs.concat(rebuttalIDs)
);

export const getIsInitiator = debateID => createSelector(
  [getActiveUserID, getInitiatorID(debateID)],
  (activeUserID, initiatorID) => activeUserID !== null && activeUserID === initiatorID
);

export const getIsResponder = debateID => createSelector(
  [getActiveUserID, getResponderID(debateID)],
  (activeUserID, responderID) => activeUserID !== null && activeUserID === responderID
);

export const getIsMyTurn = debateID => createSelector(
  [
    getIsOver(debateID), 
    getAllStatementIDs(debateID),
    getIsInitiator(debateID),
    getIsResponder(debateID)
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

export const getNeedPositionStatement = debateID => createSelector(
  [
    getPositionStatements(debateID),
    getIsInitiator(debateID),
    getIsResponder(debateID)
  ],
  (positionStatements: any, isInitiator, isResponder) => {
    if (isInitiator) {
      return !positionStatements.get('initiator');
    } else if (isResponder) {
      return !positionStatements.get('responder');
    } else {
      return false;
    }
  }
);

export const getNeedOpeningStatement = debateID => createSelector(
  [
    getOpeningStatementIDs(debateID),
    getIsInitiator(debateID),
    getIsResponder(debateID)
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