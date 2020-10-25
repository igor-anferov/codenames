import React from 'react';

import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import colors from './colors';

const useStyles = makeStyles(theme => createStyles({
  board: {
    ...theme.typography.button,
    fontSize: 'calc(max(10vh, 36px) - 16px)',
    backgroundColor: props => colors[props.color].normal.back,
    color: props => colors[props.color].normal.text,
    height: '100%',
    width: '100%',
  },
}));

export default function Score({ color, children }) {
  const classes = useStyles({ color });

  return (
    <Grid container
      className={classes.board}
      alignItems='center'
      wrap='nowrap'
    >
      <Grid container
        direction='column'
        alignItems='center'
        wrap='nowrap'
      >
        { children }
      </Grid>
    </Grid>
  )
}
