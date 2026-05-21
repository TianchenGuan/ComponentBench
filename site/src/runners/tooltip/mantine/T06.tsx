'use client';

/**
 * tooltip-mantine-T06: Match reference tooltip within a Tooltip.Group
 *
 * Light theme, comfortable spacing, isolated card centered.
 * Three Mantine Buttons ("Basic", "Pro", "Enterprise") are arranged in a row. Each button is wrapped in its own Tooltip with a short description:
 * - Basic → "Good for personal projects"
 * - Pro → "Team features included"
 * - Enterprise → "Custom contracts and SSO"
 * All three are wrapped by Tooltip.Group configured with openDelay=400ms and closeDelay=100ms, so tooltips appear after a short delay.
 * A non-interactive "Reference" box shows a static tooltip bubble with the target text.
 * Instances: 3 tooltips. Initial state: none visible.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tooltip, Button, Group, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Team features included')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text fw={500} size="lg" mb="md">
            Choose a Plan
          </Text>

          <Tooltip.Group openDelay={400} closeDelay={100}>
            <Group>
              <Tooltip label="Good for personal projects">
                <Button variant="outline" data-testid="tooltip-trigger-basic">
                  Basic
                </Button>
              </Tooltip>
              <Tooltip label="Team features included">
                <Button variant="outline" data-testid="tooltip-trigger-pro">
                  Pro
                </Button>
              </Tooltip>
              <Tooltip label="Custom contracts and SSO">
                <Button variant="outline" data-testid="tooltip-trigger-enterprise">
                  Enterprise
                </Button>
              </Tooltip>
            </Group>
          </Tooltip.Group>
        </div>

        <Box
          id="reference-tooltip-3"
          style={{
            background: '#1f1f1f',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          <Text size="xs" c="dimmed" mb={4}>Reference</Text>
          Team features included
        </Box>
      </div>
    </Card>
  );
}
