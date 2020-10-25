import { grey, red, blue } from '@material-ui/core/colors';

const colors = {
  closed: {
    text: '#6b5338',
    back: '#e1d3c3',
    backHover: '#cfb9a1',
  },
  red: {
    normal: {
      text: '#8b1515',
      back: red[500],
    },
    light: {
      text: red[200],
      back: red[50],
    },
  },
  blue: {
    normal: {
      text: blue[900],
      back: blue[500],
    },
    light: {
      text: blue[200],
      back: blue[50],
    },
  },
  white: {
    normal: {
      text: grey[600],
      back: grey[200],
    },
    light: {
      text: grey[300],
      back: grey[50],
    },
  },
  black: {
    normal: {
      text: '#1a1a1a',
      back: grey[700],
    },
    light: {
      text: grey[700],
      back: grey[500],
    },
  },
}

export default colors
