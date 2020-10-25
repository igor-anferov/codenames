import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';

import { v4 as uuid } from 'uuid';

function MainPage({ history }) {
  return (
    <Box m='auto'>
      <Button
        variant="contained"
        size='large'
        onClick={() => {
          history.push('/rooms/' + uuid())
        }}
      >
        Создать комнату
      </Button>
    </Box>
  )
}

export default withRouter(MainPage)
