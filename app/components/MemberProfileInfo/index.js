// @flow

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import ImageIcon from '@material-ui/icons/Image';

import { history } from 'components/ConnectedRouter';
import PhotoModal from 'components/PhotoModal';
import UserAvatar from 'components/UserAvatar';

const styles = theme => ({
  root: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  },
  topSection: {
    position: 'relative',
  },
  shareButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      right: '13px',
    },
  },
  imageButton: {
    position: 'absolute',
    top: 30,
    right: 60,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      right: '53px',
      display: 'none',
    },
  },
  smallImageButton: {
    position: 'absolute',
    top: 30,
    right: 60,
    color: theme.palette.common.white,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      top: '15px',
      right: '53px',
      display: 'flex',
    },
  },
  avatarContainer: {
    position: 'absolute',
    left: 30,
    bottom: -60,
    padding: 3,
    borderRadius: '50%',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 2px 4px 0 rgba(187, 187, 187, 0.5)',
    [theme.breakpoints.down('xs')]: {
      left: '50%',
      bottom: '-47.5px',
      transform: 'translate(-50%)',
    },
  },
  avatar: {
    width: 120,
    height: 120,
    [theme.breakpoints.down('xs')]: {
      width: 95,
      height: 95,
    },
  },
  backgroundImage: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    height: '342px',
    opacity: 0.5,
    backgroundImage:
      'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))',
    [theme.breakpoints.down('xs')]: {
      height: '180px',
    },
  },
  bottomSection: {
    backgroundColor: theme.palette.common.white,
    paddingBottom: 20,
    paddingTop: 80,
  },
  username: {
    fontSize: 24,
    fontWeight: 500,
    textTransform: 'capitalize',
    marginLeft: 30,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      textAlign: 'center',
    },
  },
  distance: {
    marginLeft: 30,
    fontSize: 15,
    color: 'rgba(60, 62, 67, 0.6)',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      textAlign: 'center',
    },
  },
  location: {
    marginLeft: 30,
    fontSize: 15,
    color: 'rgba(60, 62, 67, 0.6)',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      textAlign: 'center',
    },
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  bio: {
    fontSize: 18,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      marginTop: 20,
    },
  },
  socialButtons: {
    marginLeft: 30,
    marginRight: 30,
    width: 'auto',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
  },
  iconButton: {
    '&:hover svg': {
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
  icon: {
    color: '#b3b9bf',
    fill: '#b3b9bf',
  },
  aggregateLine: {
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  aggregateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
  },
  aggregateLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#555555',
  },
});

type Props = {
  user: Object,
  files: Object,
  classes: Object,
  openShareModal: Function,
};

type State = {
  isOpen: boolean,
};

class MemberProfileInfo extends Component<Props, State> {
  state = {
    isOpen: false,
  };
  openUrl = url => {
    window.open(url, '_blank');
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  render() {
    const { user, files, classes } = this.props;
    const { isOpen } = this.state;
    const avatarImg = user.getIn(['profile', 'avatar']) || '';
    return (
      <div className={classes.root}>
        <div className={classes.topSection}>
          <div
            className={classes.backgroundImage}
            style={{
              backgroundImage: `url('${user.getIn([
                'profile',
                'backgroundImage',
              ])}')`,
            }}
          >
            <div className={classes.overlay} />
          </div>
          {user.getIn(['profile', 'showImageLibrary']) && (
            <Fragment>
              <IconButton
                className={classes.imageButton}
                onClick={() => this.setState({ isOpen: true })}
              >
                <ImageIcon />
              </IconButton>
              <IconButton
                className={classes.smallImageButton}
                onClick={() => history.push(`/f/${user.get('slug')}/gallery`)}
              >
                <ImageIcon />
              </IconButton>
            </Fragment>
          )}
          <IconButton
            className={classes.shareButton}
            onClick={() => this.props.openShareModal('Top Profile')}
          >
            <ShareIcon />
          </IconButton>
          <div className={classes.avatarContainer}>
            <UserAvatar className={classes.avatar} src={avatarImg} />
          </div>
        </div>
        <div className={classes.bottomSection}>
          <Typography className={classes.username}>
            {`${user.get('firstName') || ''} ${user.get('lastName') || ''}`}
          </Typography>
          {user.getIn(['profile', 'distance']) && (
            <Typography className={classes.distance}>
              {`Works within ${user.getIn(['profile', 'distance'])} miles of`}
            </Typography>
          )}
          {user.getIn(['profile', 'location']) && (
            <Typography className={classes.location}>
              {user.getIn(['profile', 'location'])}
            </Typography>
          )}
        </div>
        <PhotoModal
          user={user}
          files={files}
          isOpen={isOpen}
          onCloseModal={this.closeModal}
        />
      </div>
    );
  }
}

export default withStyles(styles)(MemberProfileInfo);
