import {Map} from 'immutable';
import {createSelector} from "reselect";

export const getActiveAuthorID = state => state.get("activeAuthorID", null);
export const getAuthor = (state, {authorID}) => state.getIn(["authors", authorID], Map());

const makeAuthorGetter = (key, def = null) => createSelector(
  getAuthor,
  author => author ? author.get(key, def) : def
);

export const getName = makeAuthorGetter("name", "");
export const getDescription = makeAuthorGetter("description", "");
export const getImageURL = makeAuthorGetter("imageURL", "");