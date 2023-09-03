'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useRouter } from 'next/navigation';

import { v4 as uuid } from 'uuid';

export default function MainPage() {
  const router = useRouter();

  return (
    <Box m='auto'>
      <Button
        variant="contained"
        size='large'
        onClick={() => {
          router.push('/rooms/' + uuid())
        }}
      >
        Создать комнату
      </Button>
    </Box>
  )
}
