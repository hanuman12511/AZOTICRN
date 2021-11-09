import * as types from './types';
import {combineReducers} from 'redux';

const liveStoriesReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_STORIES:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const commentPostReducer = (state = {}, action) => {
  switch (action.type) {
    case types.COMMENT_POST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const likePostReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIKE_POST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const newsFeedReducer = (state = {}, action) => {
  switch (action.type) {
    case types.NEWS_FEED:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const viewCommentsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VIEW_COMMENTS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const viewLikesReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VIEW_LIKES:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const sharePostReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SHARE_POST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const commentDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case types.COMMENT_DELETE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const reportOrBlockReducer = (state = {}, action) => {
  switch (action.type) {
    case types.REPORT_OR_BLOCK:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const addReactionReducer = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_REACTION:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const postDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case types.POST_DETAIL:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  liveStories: liveStoriesReducer,
  commentPost: commentPostReducer,
  likePost: likePostReducer,
  newsFeed: newsFeedReducer,
  viewComments: viewCommentsReducer,
  viewLikes: viewLikesReducer,
  sharePost: sharePostReducer,
  commentDelete: commentDeleteReducer,
  reportOrBlock: reportOrBlockReducer,
  addReaction: addReactionReducer,
  postDetail: postDetailReducer,
});

export default reducer;
