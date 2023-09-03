'use client';

import Room from '../Room';

export default function CaptainsView({ ...props }) {
  return (
    <Room
      { ...props }
      is_captain
    />
  )
}
