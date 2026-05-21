'use client';

/**
 * link-mantine-T01: Navigate via Support Center anchor (Mantine)
 * 
 * setup_description:
 * A centered isolated card titled "Help" contains exactly one Mantine Anchor component
 * labeled "Support Center". The Anchor uses default Mantine styling (text link with
 * hover underline).
 * 
 * Initial route is "/home". Activating the Anchor performs client-side navigation to
 * "/support" and updates the card title to "Support Center". The Anchor remains visible
 * and is marked active via aria-current="page" for observability.
 * 
 * success_trigger:
 * - The "Support Center" Anchor (data-testid="link-support") was activated.
 * - The current route pathname equals "/support".
 * - The activated link has aria-current="page".
 */

import React, { useState } from 'react';
import { Card, Text, Anchor } from '@mantine/core';
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        {isOnSupport ? 'Support Center' : 'Help'}
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Need assistance? Visit our support resources.
      </Text>
      <Anchor
        href="/support"
        onClick={handleClick}
        data-testid="link-support"
        aria-current={isOnSupport ? 'page' : undefined}
      >
        Support Center
      </Anchor>
    </Card>
  );
}
