// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import Icon from 'components/Icon';
import CheckIcon from 'images/sprite/green_checkmark.svg';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '18px 2px 18px 18px',
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
  icon: {
    position: 'absolute',
    right: 18,
    top: 18,
  },
});

type Props = {
  user: Object,
  classes: Object,
  onSelect: Function,
  size?: string,
  selected: boolean,
};

class UserCard extends Component<Props> {
  static defaultProps = {
    size: 'default',
  };
  render() {
    const { user, size, selected, classes } = this.props;
    const nameLength =
      user.get('firstName').length + user.get('lastName').length;
    const nameLimit = size === 'small' ? 18 : 25;
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
          secondary={
            nameLength > nameLimit
              ? `${capitalize(user.get('firstName'))} ${capitalize(
                  user.get('lastName').substr(0, 1)
                )}.`
              : `${capitalize(user.get('firstName'))} ${capitalize(
                  user.get('lastName')
                )}`
          }
          classes={{
            primary: classes.location,
            secondary: classes.name,
          }}
        />
        {selected && (
          <Icon glyph={CheckIcon} size={20} className={classes.icon} />
        )}
      </ListItem>
    );
  }
}

export default withStyles(styles)(UserCard);
