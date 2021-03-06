// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import UserAvatar from 'components/UserAvatar';
import UserCredStats from 'components/UserCredStats';
import PostFormModal from 'components/PostFormModal';
import PostCard from 'components/PostCard';
import FeedFilter from 'components/FeedFilter';
import FeedFilterModal from 'components/FeedFilterModal';
import UserCredModal from 'components/UserCredModal';
import Link from 'components/Link';
import Icon from 'components/Icon';
import PlusIcon from 'images/sprite/plus_white.svg';
import FilterIcon from 'images/sprite/filter.svg';
import CredIcon from 'images/sprite/cred_white.svg';

import saga, {
  reducer,
  requestPosts,
  requestCreatePost,
  requestUpdatePost,
  requestRemovePost,
  requestVotePost,
  requestCreateComment,
  toggleCommentSection,
  showNextComment,
} from 'containers/Feed/sagas';
import { requestUser } from 'containers/App/sagas';
import injectSagas from 'utils/injectSagas';

import { CATEGORY_OPTIONS } from 'enum/constants';

const styles = theme => ({
  root: {
    width: 1064,
    margin: '0 auto',
    paddingTop: 25,
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      paddingTop: 0,
      width: '100%',
      display: 'block',
    },
  },
  leftPanel: {
    width: 223,
    marginRight: 26,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  profileInfo: {
    marginBottom: 30,
    paddingLeft: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  greetings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#373737',
    textTransform: 'capitalize',
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.7px',
    textTransform: 'none',
    textDecoration: 'none',
  },
  content: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 103px)',
      overflowY: 'scroll',
    },
  },
  createPostPanel: {
    backgroundColor: theme.palette.common.white,
    padding: '15px 20px 18px 21px',
    boxShadow: '0 10px 15px 5px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    marginBottom: 30,
  },
  createPostAvatar: {
    width: 45,
    height: 45,
    marginRight: 20,
  },
  createPostTitle: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.3,
    color: '#9f9f9f',
  },
  rightPanel: {
    width: 223,
    marginLeft: 26,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mobileMenu: {
    backgroundColor: '#083f76',
    height: 55,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  mobileButtonWrapper: {
    marginLeft: 10,
    marginRight: 10,
  },
  mobileButton: {
    fontWeight: 600,
    color: theme.palette.common.white,
    textTransform: 'none',
  },
});

type Props = {
  user: Object,
  posts: List<Map>,
  isCreating: boolean,
  createError: string,
  isUpdating: boolean,
  updateError: string,
  isVoting: boolean,
  voteError: string,
  isRemoving: boolean,
  removeError: string,
  classes: Object,
  requestCreatePost: Function,
  requestUpdatePost: Function,
  requestPosts: Function,
  requestVotePost: Function,
  requestRemovePost: Function,
  requestUser: Function,
  requestCreateComment: Function,
  toggleCommentSection: Function,
  showNextComment: Function,
};

type State = {
  isOpen: boolean,
  isFilterOpen: boolean,
  isCredOpen: boolean,
  query: ?Object,
  editingPost: Object,
};

class FeedPage extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.user && prevState.query === undefined) {
      return {
        query: {
          location: nextProps.user.getIn(['profile', 'location']),
          categories: CATEGORY_OPTIONS.map(option => option.value),
        },
      };
    }
    return null;
  }
  state = {
    isOpen: false,
    isFilterOpen: false,
    isCredOpen: false,
    query: undefined,
    editingPost: null,
  };
  componentDidMount() {
    const { query } = this.state;
    this.props.requestPosts(query);
  }
  componentDidUpdate(prevProps: Props) {
    const {
      isCreating,
      createError,
      isUpdating,
      updateError,
      isVoting,
      voteError,
      isRemoving,
      removeError,
    } = this.props;
    const { query } = this.state;
    if (prevProps.isCreating && !isCreating && !createError) {
      this.props.requestPosts(query);
    }
    if (prevProps.isUpdating && !isUpdating && !updateError) {
      this.props.requestPosts(query);
    }
    if (prevProps.isVoting && !isVoting && !voteError) {
      this.props.requestPosts(query);
      this.props.requestUser();
    }
    if (prevProps.isRemoving && !isRemoving && !removeError) {
      this.props.requestPosts(query);
    }
  }
  openModal = () => {
    this.setState({ editingPost: null, isOpen: true });
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  openFilterModal = () => {
    this.setState({ isFilterOpen: true });
  };
  closeFilterModal = () => {
    this.setState({ isFilterOpen: false });
  };
  openCredModal = () => {
    this.setState({ isCredOpen: true });
  };
  closeCredModal = () => {
    this.setState({ isCredOpen: false });
  };
  savePost = data => {
    this.closeModal();
    this.props.requestCreatePost(data);
  };
  updatePost = (id, data) => {
    this.closeModal();
    this.props.requestUpdatePost(id, data);
  };
  handleFilterChange = query => {
    this.setState({ query }, () => {
      this.props.requestPosts(query);
    });
  };
  editPost = post => {
    this.setState({
      editingPost: post,
      isOpen: true,
    });
  };
  render() {
    const { user, posts, classes } = this.props;
    const { isOpen, isFilterOpen, isCredOpen, query, editingPost } = this.state;
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid
            container
            alignItems="center"
            justify="center"
            className={classes.mobileMenu}
          >
            <Grid item className={classes.mobileButtonWrapper}>
              <Button className={classes.mobileButton} onClick={this.openModal}>
                <Icon glyph={PlusIcon} size={20} />
                &nbsp;&nbsp;Post
              </Button>
            </Grid>
            <Grid item className={classes.mobileButtonWrapper}>
              <Button
                className={classes.mobileButton}
                onClick={this.openFilterModal}
              >
                <Icon glyph={FilterIcon} size={20} />
                &nbsp;&nbsp;Filter
              </Button>
            </Grid>
            <Grid item className={classes.mobileButtonWrapper}>
              <Button
                className={classes.mobileButton}
                onClick={this.openCredModal}
              >
                <Icon glyph={CredIcon} size={19} />
                &nbsp;&nbsp;
                {`${user.getIn(['profile', 'cred'])} Cred`}
              </Button>
            </Grid>
          </Grid>
          <div className={classes.leftPanel}>
            <Grid
              container
              alignItems="center"
              classes={{
                container: classes.profileInfo,
              }}
            >
              <Grid item>
                <UserAvatar
                  className={classes.avatar}
                  src={user.getIn(['profile', 'avatar'])}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6" className={classes.greetings}>
                  {`Hi, ${user.get('firstName')}!`}
                </Typography>
                <Link to="/edit" className={classes.link}>
                  View Profile
                </Link>
              </Grid>
            </Grid>
            <FeedFilter
              user={user}
              query={query}
              onChange={this.handleFilterChange}
            />
          </div>
          <div className={classes.content}>
            <Grid
              container
              alignItems="center"
              className={classes.createPostPanel}
              onClick={this.openModal}
            >
              <Grid item>
                <UserAvatar
                  src={user.getIn(['profile', 'avatar'])}
                  className={classes.createPostAvatar}
                />
              </Grid>
              <Grid item>
                <Typography className={classes.createPostTitle}>
                  Create a post...
                </Typography>
              </Grid>
            </Grid>
            {posts &&
              posts.map(post => (
                <PostCard
                  post={post}
                  key={generate()}
                  currentUser={user}
                  votePost={this.props.requestVotePost}
                  removePost={this.props.requestRemovePost}
                  createComment={this.props.requestCreateComment}
                  editPost={this.editPost}
                  toggleComment={this.props.toggleCommentSection}
                  showNextComment={this.props.showNextComment}
                />
              ))}
          </div>
          <div className={classes.rightPanel}>
            <UserCredStats user={user} onClick={this.openModal} />
          </div>
        </div>
        <PostFormModal
          isOpen={isOpen}
          user={user}
          post={editingPost}
          onCloseModal={this.closeModal}
          onSave={this.savePost}
          onUpdate={this.updatePost}
        />
        <FeedFilterModal
          isOpen={isFilterOpen}
          user={user}
          query={query}
          onCloseModal={this.closeFilterModal}
          onChange={this.handleFilterChange}
        />
        <UserCredModal
          isOpen={isCredOpen}
          user={user}
          onCloseModal={this.closeCredModal}
          openPostModal={this.openModal}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  posts: state.getIn(['feed', 'posts']),
  isCreating: state.getIn(['feed', 'isCreating']),
  createError: state.getIn(['feed', 'createError']),
  isUpdating: state.getIn(['feed', 'isUpdating']),
  updateError: state.getIn(['feed', 'updateError']),
  isVoting: state.getIn(['feed', 'isVoting']),
  voteError: state.getIn(['feed', 'voteError']),
  isRemoving: state.getIn(['feed', 'isRemoving']),
  removeError: state.getIn(['feed', 'removeError']),
});

const mapDispatchToProps = dispatch => ({
  requestCreatePost: payload => dispatch(requestCreatePost(payload)),
  requestUpdatePost: (id, payload) => dispatch(requestUpdatePost(id, payload)),
  requestPosts: payload => dispatch(requestPosts(payload)),
  requestRemovePost: postId => dispatch(requestRemovePost(postId)),
  requestVotePost: postId => dispatch(requestVotePost(postId)),
  requestUser: () => dispatch(requestUser()),
  requestCreateComment: payload => dispatch(requestCreateComment(payload)),
  toggleCommentSection: postId => dispatch(toggleCommentSection(postId)),
  showNextComment: postId => dispatch(showNextComment(postId)),
});

export default compose(
  injectSagas({ key: 'feed', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(FeedPage);
