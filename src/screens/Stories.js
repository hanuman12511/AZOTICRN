import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import Modal from 'react-native-modalbox';
import {CubeNavigationHorizontal} from 'react-native-3dcube-navigation';
// import liveStories from '../constants/liveStories';
import StoryContainer from '../components/StoriesComponents/StoryContainer';

const Stories = props => {
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);

  const onStorySelect = index => {
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onStoryClose = () => {
    setModel(false);
  };

  const onStoryNext = isScroll => {
    const newIndex = currentUserIndex + 1;
    if (liveStories.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = isScroll => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = scrollValue => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);

      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious();

      setCurrentScrollValue(scrollValue);
    }
  };
  const {
    liveStories,
    handlePostComment,
    handleReportStory,
    handleStoryReaction,
  } = props;

  const postTheComment = (comment, postId) => {
    handlePostComment(comment, postId);
  };

  const reactToStory = async (postId, reactions, isPoll = '') => {
    await handleStoryReaction(postId, reactions, isPoll);
  };

  const replyToStory = async (postId, reactions = '', isPoll) => {
    await handleStoryReaction(postId, reactions, isPoll);
  };

  const reportTheStory = (postId, is_block, reason) => {
    handleReportStory(postId, is_block, reason);
  };

  const renderSeperator = () => (
    <View style={{height: 1, backgroundColor: '#ccc'}} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={liveStories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => onStorySelect(index)}
            style={styles.storyTile}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.circle}
                source={{uri: item.profile}}
                isHorizontal
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />

      {/*   <FlatList
        data={liveStories}
        ItemSeparatorComponent={renderSeperator}
        style={{paddingHorizontal: 10}}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => onStorySelect(index)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={styles.circle} source={{uri: item.profile}} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
 */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll.current.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}>
        {/* eslint-disable-next-line max-len */}
        <CubeNavigationHorizontal
          callBackAfterSwipe={g => onScrollChange(g)}
          ref={modalScroll}
          style={styles.container}>
          {liveStories.map((item, index) => (
            <StoryContainer
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              user={item}
              isNewStory={index !== currentUserIndex}
              postTheComment={postTheComment}
              reportTheStory={reportTheStory}
              reactToStory={reactToStory}
              replyToStory={replyToStory}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255,255,255,255)',
    padding: wp(2),
    marginBottom: hp(-0.8),
  },

  storyTile: {
    width: wp(15),
    alignItems: 'center',
  },

  imageContainer: {
    width: wp(14),
    // marginHorizontal: wp(1),
    height: wp(14),
    borderRadius: wp(7.5),
    borderWidth: 2,
    borderColor: '#F57C00',
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    width: wp(12),
    // marginHorizontal: wp(1),
    height: wp(12),
    borderRadius: wp(6),
    // backgroundColor: '#fff',
  },
  modal: {
    flex: 1,
  },
  title: {
    color: '#333',
    fontSize: wp(2.6),
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: wp(1),
  },
});

export default Stories;
