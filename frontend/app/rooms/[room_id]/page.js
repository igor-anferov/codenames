'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useRouter } from 'next/navigation';

export default function RoomMainPage({ params }) {
  const router = useRouter();

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
              router.push(`/rooms/${params.room_id}/views/players`)
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
              router.push(`/rooms/${params.room_id}/views/captains`)
            }}
          >
            К полю для капитанов
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
