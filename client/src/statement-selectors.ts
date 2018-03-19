import {Map} from "immutable";
import {createSelector} from "reselect";
import {getDebates, getInitiatorID, getResponderID} from "./debate-selectors.ts";

export const getStatements = state => state.get("statements", Map());
export const getStatement = (state, {statementID}) => state.getIn(["statements", "byID", statementID], Map());

const makeStatementGetter = (key, def = null) => createSelector(
  getStatement,
  statement => statement ? statement.get(key, def) : def
);

export const getAuthorID = makeStatementGetter("authorID", null);
export const getDebateID = makeStatementGetter("debateID", null);
export const getText = makeStatementGetter("text", "");
export const getDate = makeStatementGetter("date", "");
export const getIsLoading = makeStatementGetter("isLoading", false);
export const getIsLoaded = makeStatementGetter("isLoaded", false);
export const getError = makeStatementGetter("error", null);

export const getStatementDebate = createSelector(
  [getDebateID, getDebates],
  (debateID, debates) => debates.getIn(["byID", debateID], Map())
);

export const getDebateInitiatorID = createSelector(
  getStatementDebate,
  debate => debate.get("initiatorID", null)
);

export const getDebateResponderID = createSelector(
  getStatementDebate,
  debate => debate.get("responderID", null)
);

export const getIsInitiatorStatement = createSelector(
  [getAuthorID, getDebateInitiatorID],
  (authorID, initiatorID) => authorID === initiatorID
);

export const getIsResponderStatement = createSelector(
  [getAuthorID, getDebateResponderID],
  (authorID, responderID) => authorID === responderID
);

export const getPermalink = createSelector(
  [(_, {statementID})=>statementID, getDebateID],
  (statementID, debateID) => `http://yodebate.me/${debateID}#${statementID}`
);