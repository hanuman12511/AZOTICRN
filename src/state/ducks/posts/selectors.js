export const isLiveStories = state => {
  return state.posts.liveStories;
};
export const isCommentPost = state => {
  return state.posts.commentPost;
};
export const isLikePost = state => {
  return state.posts.likePost;
};
export const isNewsFeed = state => {
  return state.posts.newsFeed;
};
export const isViewComments = state => {
  return state.posts.viewComments;
};
export const isViewLikes = state => {
  return state.posts.viewLikes;
};
export const isSharePost = state => {
  return state.posts.sharePost;
};
export const isCommentDelete = state => {
  return state.posts.commentDelete;
};
export const isReportOrBlock = state => {
  return state.posts.reportOrBlock;
};
export const isAddReaction = state => {
  return state.posts.addReaction;
};
export const isPostDetail = state => {
  return state.posts.postDetail;
};
