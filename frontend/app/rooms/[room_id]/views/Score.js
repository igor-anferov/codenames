import React from 'react';

import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';

import colors from './colors';

const StyledGrid = styled(Grid)(({ color, theme }) => ({
  ...theme.typography.button,
  fontSize: 'calc(max(10vh, 36px) - 16px)',
  backgroundColor: colors[color].normal.back,
  color: colors[color].normal.text,
  height: '100%',
  width: '100%',
}));

export default function Score({ color, children }) {
  return (
    <StyledGrid container color={color}
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
    </StyledGrid>
  );
}
