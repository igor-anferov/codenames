import React from 'react';

import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';

import colors from './colors';

function getColors(props) {
  if (!props.is_captain && !props.is_open) {
    return colors.closed
  }
  if (!props.is_captain || !props.is_open) {
    return colors[props.color].normal
  }
  return colors[props.color].light
}

const CardButton = styled(Button)(({colors, card_disabled}) => ({
  height: '100%',
  width: '100%',
  padding: 0,
  fontSize: '2vw',
  color: colors.text,
  backgroundColor: colors.back,
  "&:hover": {
    backgroundColor: colors[card_disabled ? 'back' : 'backHover'],
  },
  cursor: card_disabled ? 'default' : undefined
}))

export default function Card(props) {
  const { is_open, word, color, is_captain, onClick } = props
  const disabled = is_open || is_captain

  return (
    <CardButton
      colors={ getColors(props) }
      card_disabled={ disabled }
      disableElevation={ disabled }
      disableFocusRipple={ disabled }
      disableRipple={ disabled }
      variant="contained"
      size='large'
      fullWidth
      onClick={ onClick }
    >
      { word }
    </CardButton>
  )
}
