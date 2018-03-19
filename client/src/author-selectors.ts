import {Map} from "immutable";
import {createSelector} from "reselect";

export const getAuthors = state => state.get("authors", Map());
export const getActiveAuthorID = createSelector(
  getAuthors,
  authors => authors.get("activeAuthorID", null)
);
export const getAuthTested = createSelector(
  getAuthors,
  authors => authors.get("authTested", false)
);
export const getAuthor = (state, {authorID}) => (
  authorID 
    ? state.getIn(["authors", "byID", authorID], Map())
    : state.getIn(["authors", "byID", getActiveAuthorID(state)], Map())
);

const makeAuthorGetter = (key, def = null) => createSelector(
  getAuthor,
  author => author ? author.get(key, def) : def
);

export const getName = makeAuthorGetter("name", "");
export const getDescription = makeAuthorGetter("description", "");
export const getImageURL = makeAuthorGetter("imageURL", "");
export const getIsLoading = makeAuthorGetter("isLoading", false);
export const getIsLoaded = makeAuthorGetter("isLoaded", false);
export const getError = makeAuthorGetter("error", null);

export const getIsLoggedIn = createSelector(
  [getAuthTested, getActiveAuthorID],
  (authTested, activeAuthorID) => authTested && !!activeAuthorID
);
