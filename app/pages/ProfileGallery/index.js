// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CameraIcon from '@material-ui/icons/CameraAlt';

import Link from 'components/Link';

import {
  requestUser,
  requestUserPhotoUpload,
  requestUserFiles,
  requestUserDataUpdate,
} from 'containers/App/sagas';

const styles = theme => ({
  root: {},
  header: {
    flexGrow: 1,
    padding: '10px 15px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  backButton: {
    color: theme.palette.common.white,
    textTransform: 'none',
    paddingLeft: 0,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  fileInput: {
    display: 'none',
  },
  contentWrapper: {
    padding: 10,
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  fileWrapper: {
    width: 174,
    height: 174,
    padding: 3,
  },
  selected: {
    border: '2px solid #000000',
  },
});

type Props = {
  user: Object,
  files: Object,
  isUploading: boolean,
  uploadError: string,
  classes: Object,
  location: Object,
  requestUser: Function,
  requestUserFiles: Function,
  uploadPhoto: Function,
  updateUser: Function,
};

class ProfileGallery extends Component<Props> {
  componentDidMount() {
    this.props.requestUser();
    this.props.requestUserFiles();
  }
  componentDidUpdate(prevProps: Props) {
    const { isUploading, uploadError } = this.props;
    if (prevProps.isUploading && !isUploading && !uploadError) {
      this.props.requestUserFiles();
    }
  }
  onAddClick = (e: Event) => {
    e.preventDefault();
    if (this.fileInput.current) this.fileInput.current.click();
  };
  handleFileUpload = ({ target }: Event) => {
    const reader = new FileReader();
    reader.onload = e => {
      const block = e.target.result.split(';');
      const [, base64] = block;
      const [, realData] = base64.split(',');
      this.props.uploadPhoto(realData);
    };
    if (target instanceof HTMLInputElement) {
      const [file] = target.files;
      if (file && file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return;
      }
      reader.readAsDataURL(file);
    }
  };
  updateSelection = path => {
    const { location } = this.props;
    let type = 'avatar';
    if (location.pathname.indexOf('background-image') > -1) {
      type = 'backgroundImage';
    }
    this.props.updateUser({
      profile: {
        [type]: path,
      },
    });
  };
  fileInput = React.createRef();
  render() {
    const { classes, user, files, location } = this.props;
    let selectedFile = '';
    if (location.pathname.indexOf('avatar') > -1) {
      selectedFile = user.getIn(['profile', 'avatar']);
    } else {
      selectedFile = user.getIn(['profile', 'backgroundImage']);
    }
    return (
      <div className={classes.root}>
        <Grid
          className={classes.header}
          container
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Button
              className={classes.backButton}
              component={props => (
                <Link to={`/f/${user.get('slug')}/edit`} {...props} />
              )}
            >
              <ArrowBackIcon />
              &nbsp;Profile Images &amp; Videos
            </Button>
          </Grid>
          <Grid item>
            <CameraIcon onClick={this.onAddClick} />
            <input
              type="file"
              className={classes.fileInput}
              ref={this.fileInput}
              onChange={this.handleFileUpload}
            />
          </Grid>
        </Grid>
        <div className={classes.contentWrapper}>
          {files.map(file => (
            <div
              className={cx(classes.fileWrapper, {
                [classes.selected]: selectedFile === file.get('path'),
              })}
              key={generate()}
              onClick={() => this.updateSelection(file.get('path'))}
              role="button"
            >
              <img src={file.get('path')} alt={file.get('_id')} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
  files: state.getIn(['app', 'files']),
  isFileLoading: state.getIn(['app', 'isFileLoading']),
  fileError: state.getIn(['app', 'fileError']),
  isUploading: state.getIn(['app', 'isUploading']),
  uploadError: state.getIn(['app', 'uploadError']),
});

const mapDispatchToProps = dispatch => ({
  requestUser: () => dispatch(requestUser()),
  uploadPhoto: payload => dispatch(requestUserPhotoUpload(payload)),
  requestUserFiles: () => dispatch(requestUserFiles()),
  updateUser: payload => dispatch(requestUserDataUpdate(payload)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(ProfileGallery);