import {Map} from "immutable";
import {createSelector} from "reselect";

export const getAuthors = state => state.get("authors", Map());
export const getActiveAuthorID = createSelector(
  getAuthors,
  authors => authors.get("activeAuthorID", null)
);
export const getAuthor = (state, {authorID}) => state.getIn(["authors", "byID", authorID], Map());

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