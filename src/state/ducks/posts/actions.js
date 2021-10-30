import * as types from "./types";

export const liveStories = (payload) => ({
  type: types.LIVE_STORIES,
  payload,
});
export const commentPost = (payload) => ({
  type: types.COMMENT_POST,
  payload,
});
export const likePost = (payload) => ({
  type: types.LIKE_POST,
  payload,
});
export const newsFeed = (payload) => ({
  type: types.NEWS_FEED,
  payload,
});
export const viewComments = (payload) => ({
  type: types.VIEW_COMMENTS,
  payload,
});
export const viewLikes = (payload) => ({
  type: types.VIEW_LIKES,
  payload,
});
export const sharePost = (payload) => ({
  type: types.SHARE_POST,
  payload,
});
export const commentDelete = (payload) => ({
  type: types.COMMENT_DELETE,
  payload,
});
export const reportOrBlock = (payload) => ({
  type: types.REPORT_OR_BLOCK,
  payload,
});
export const addReaction = (payload) => ({
  type: types.ADD_REACTION,
  payload,
});
export const error = (payload) => ({
  type: types.ERROR,
  payload,
});
