// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: 18,
    cursor: 'pointer',
  },
  noPadding: {
    padding: 0,
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#afafaf',
    width: 50,
    height: 50,
  },
  location: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.3,
    color: '#9b9b9b',
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#4a4a4a',
  },
});

type Props = {
  user: Object,
  classes: Object,
  onSelect: Function,
  size?: string,
};

class UserCard extends Component<Props> {
  static defaultProps = {
    size: 'default',
  };
  render() {
    const { user, size, classes } = this.props;
    return (
      <ListItem
        className={cx(classes.root, {
          [classes.noPadding]: size === 'small',
        })}
        onClick={() => this.props.onSelect(user)}
      >
        <Avatar
          alt={`${user.get('firstName')} ${user.get('lastName')}`}
          src={user.getIn(['profile', 'avatar'])}
          className={classes.avatar}
        />
        <ListItemText
          primary={user.getIn(['profile', 'location'])}
          secondary={`${capitalize(user.get('firstName'))} ${capitalize(
            user.get('lastName').substr(0, 1)
          )}.`}
          classes={{
            primary: classes.location,
            secondary: classes.name,
          }}
        />
      </ListItem>
    );
  }
}

export default withStyles(styles)(UserCard);
