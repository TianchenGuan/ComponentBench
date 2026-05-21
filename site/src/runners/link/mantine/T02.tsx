'use client';

/**
 * link-mantine-T02: Expand Plan Details with a button-style Anchor
 * 
 * setup_description:
 * A centered isolated card titled "Subscription" contains a collapsed section labeled
 * "Plan Details". The disclosure control is a Mantine Anchor rendered as a button-like
 * control (Anchor with component="button").
 * 
 * Initial state: aria-expanded="false" and aria-controls="plan-details" on the Anchor;
 * the details panel is hidden. On activation, the panel becomes visible and aria-expanded
 * becomes "true"; the Anchor text changes to "Hide plan details".
 * 
 * success_trigger:
 * - The "Show plan details" Anchor (data-testid="link-plan-details") was activated.
 * - The Anchor's aria-expanded equals "true".
 * - The Plan Details panel (id="plan-details") is visible.
 */

import React, { useState } from 'react';
import { Card, Text, Anchor, Collapse, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (!expanded) {
      setExpanded(true);
      onSuccess();
    } else {
      setExpanded(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Subscription
      </Text>
      <Text size="sm" c="dimmed" mb="xs">
        Plan Details: {expanded ? 'shown' : 'hidden'}
      </Text>
      <Anchor
        component="button"
        onClick={handleClick}
        data-testid="link-plan-details"
        aria-controls="plan-details"
        aria-expanded={expanded}
      >
        {expanded ? 'Hide plan details' : 'Show plan details'}
      </Anchor>
      
      <Collapse in={expanded}>
        <Box
          id="plan-details"
          mt="md"
          p="md"
          style={{ backgroundColor: 'var(--mantine-color-gray-1)', borderRadius: 4 }}
        >
          <Text size="sm">Plan: Professional</Text>
          <Text size="sm">Billing: Monthly</Text>
          <Text size="sm" fw={500} mt="xs">Price: $29.99/month</Text>
        </Box>
      </Collapse>
    </Card>
  );
}
