// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ShareIcon from '@material-ui/icons/Share';

import MemberProfileInfo from 'components/MemberProfileInfo';
import TalentInput from 'components/TalentInput';
import Link from 'components/Link';
import ShareProfileModal from 'components/ShareProfileModal';
import ContactOptionModal from 'components/ContactOptionModal';

import saga, {
  reducer,
  requestMemberTalents,
  requestMemberProfile,
} from 'containers/Member/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '40px auto 300px auto',
  },
  profileInfo: {
    marginBottom: 20,
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    marginBottom: 20,
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
  },
  shareText: {
    fontSize: 20,
    fontWeight: 500,
  },
  shareProfileButton: {
    fontSize: 17,
    fontWeight: 500,
    color: theme.palette.primary.main,
    border: '1px solid #e5e5e5',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    textTransform: 'none',
    padding: '10px 20px',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  bottomBanner: {
    padding: '25px 70px',
    backgroundColor: '#2b2b2b',
  },
  bannerText: {
    color: theme.palette.common.white,
    fontWeight: 500,
    fontSize: 26,
  },
  bannerButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
    fontWeight: 500,
    padding: '10px 20px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  topBanner: {
    padding: '25px 70px',
    backgroundColor: '#b8f3ce',
  },
  topBannerText: {
    color: '#303532',
    fontWeight: 500,
    fontSize: 18,
  },
  topBannerButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: 500,
    padding: '11px 23px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  backButton: {
    marginRight: 15,
  },
});

type Props = {
  currentUser: Object,
  member: Object,
  talents: Object,
  classes: Object,
  match: Object,
  requestMemberProfile: Function,
  requestMemberTalents: Function,
};

type State = {
  isOpen: boolean,
  isContactOpen: boolean,
};

class Member extends Component<Props, State> {
  state = {
    isOpen: false,
    isContactOpen: false,
  };
  componentDidMount() {
    const {
      currentUser,
      match: {
        params: { slug },
      },
    } = this.props;
    if (currentUser.get('slug') !== slug) {
      this.props.requestMemberProfile(slug);
    }
    this.props.requestMemberTalents(slug);
  }
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  onCloseContactModal = () => {
    this.setState({ isContactOpen: false });
  };
  render() {
    const {
      currentUser,
      member,
      talents,
      classes,
      match: {
        params: { slug },
      },
    } = this.props;
    const { isOpen, isContactOpen } = this.state;
    const data = currentUser.get('slug') === slug ? currentUser : member;
    return (
      <Fragment>
        {currentUser.get('slug') === slug && (
          <Grid
            className={classes.topBanner}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.topBannerText}>
                You&apos;re currently viewing your public profile.
              </Typography>
            </Grid>
            <Grid item>
              <Button
                className={classes.backButton}
                component={props => (
                  <Link to={`/f/${currentUser.get('slug')}/edit`} {...props} />
                )}
                color="primary"
              >
                Back
              </Button>
              <Button className={classes.topBannerButton} onClick={() => {}}>
                Copy Link
              </Button>
            </Grid>
          </Grid>
        )}
        <div className={classes.root}>
          <div className={classes.profileInfo}>
            <MemberProfileInfo user={data} />
          </div>
          {talents.size > 0 && (
            <div className={classes.section}>
              <div className={classes.sectionHeader}>
                <Typography variant="h6">Talents</Typography>
              </div>
              <div className={classes.sectionBody}>
                {talents &&
                  talents.map(talent => (
                    <TalentInput
                      key={generate()}
                      mode="read"
                      data={talent.toJS()}
                      editable={false}
                    />
                  ))}
              </div>
            </div>
          )}
          <div className={classes.section}>
            <div className={classes.sectionBody}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item lg={6}>
                  <Typography className={classes.shareText}>
                    Know someone who needs this freelancer’s talents?
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.shareProfileButton}
                    onClick={() => {
                      this.setState({ isOpen: true });
                    }}
                  >
                    <ShareIcon />
                    &nbsp;Share this profile
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        <Grid
          className={classes.bottomBanner}
          container
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography className={classes.bannerText}>
              Get in Touch!
            </Typography>
          </Grid>
          <Grid item>
            <Button
              className={classes.bannerButton}
              onClick={() => {
                this.setState({ isContactOpen: true });
              }}
            >
              Contact Options
            </Button>
          </Grid>
        </Grid>
        <ShareProfileModal isOpen={isOpen} onCloseModal={this.onCloseModal} />
        <ContactOptionModal
          isOpen={isContactOpen}
          onCloseModal={this.onCloseContactModal}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  member: state.getIn(['member', 'data']),
  isLoading: state.getIn(['member', 'isMemberLoading']),
  error: state.getIn(['member', 'memberError']),
  talents: state.getIn(['member', 'talents']),
});

const mapDispatchToProps = dispatch => ({
  requestMemberProfile: slug => dispatch(requestMemberProfile(slug)),
  requestMemberTalents: slug => dispatch(requestMemberTalents(slug)),
});

export default compose(
  injectSagas({ key: 'member', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Member);