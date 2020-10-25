import React from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';

function MainPage({ match, history }) {
  return (
    <Box m='auto'>
      <Grid container
        direction='column'
        alignItems='center'
        spacing={ 2 }
      >
        <Grid item>
          <Button
            variant="contained"
            size='large'
            onClick={() => {
              history.push(match.url + '/views/players')
            }}
          >
            К полю для игроков
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            size='large'
            onClick={() => {
              history.push(match.url + '/views/captains')
            }}
          >
            К полю для капитанов
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default withRouter(MainPage)
