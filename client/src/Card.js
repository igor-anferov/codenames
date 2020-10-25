import React from 'react';

import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import colors from './colors';

const color = dst => props => {
  if (!props.is_captain && !props.is_open) {
    return colors.closed[dst]
  }
  if (!props.is_captain || !props.is_open) {
    return colors[props.color].normal[dst]
  }
  return colors[props.color].light[dst]
}

const useStyles = makeStyles(theme => createStyles({
  card: {
    height: '100%',
    width: '100%',
    padding: 0,
    fontSize: '2vw',
    color: color('text'),
    backgroundColor: color('back'),
    "&:hover": {
      backgroundColor: color('backHover'),
    },
  },

  disabledCard: {
    "&:hover": {
      backgroundColor: color('back'),
    },
    cursor: 'default',
  }
}));

export default function Card({ is_open, word, color, is_captain, onClick }) {
  const disabled = is_open || is_captain
  const classes = useStyles({ is_open, color, is_captain });

  return (
    <Button
      className={ `${classes.card} ${disabled && classes.disabledCard}` }
      disableElevation={ disabled }
      disableFocusRipple={ disabled }
      disableRipple={ disabled }
      variant="contained"
      size='large'
      fullWidth
      onClick={ onClick }
    >
      { word }
    </Button>
  )
}
