'use client';

/**
 * link-mui-T01: Navigate via Support Center link (MUI)
 * 
 * setup_description:
 * A centered isolated card titled "Help" contains exactly one Material UI Link component
 * labeled "Support Center". The Link uses MUI defaults (inherits typography variant and
 * uses the theme primary color; underline visible by default).
 * 
 * Initial route is "/home". Activating the link performs client-side navigation to
 * pathname "/support" and updates the card title to "Support Center". The link remains
 * visible at the top of the card and is marked active with aria-current="page".
 * 
 * success_trigger:
 * - The "Support Center" MUI Link (data-testid="link-support") was activated.
 * - The current route pathname equals "/support".
 * - The activated link is marked as current (aria-current="page").
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Link, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/home');
  const [activated, setActivated] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute('/support');
    setActivated(true);
    onSuccess();
  };

  const isOnSupport = route === '/support';

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title={isOnSupport ? 'Support Center' : 'Help'} />
      <CardContent>
        <Typography sx={{ mb: 2 }}>
          Need assistance? Visit our support resources.
        </Typography>
        <Link
          href="/support"
          onClick={handleClick}
          data-testid="link-support"
          aria-current={isOnSupport ? 'page' : undefined}
          sx={{ cursor: 'pointer' }}
        >
          Support Center
        </Link>
      </CardContent>
    </Card>
  );
}
