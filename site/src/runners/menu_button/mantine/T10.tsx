'use client';

/**
 * menu_button-mantine-T10: Set Card B status by matching color reference
 * 
 * Layout: dashboard scene with high clutter.
 * The dashboard shows three small cards (A, B, C) and a status toolbar on the right.
 * There are three menu buttons (instances=3): "Card A status", "Card B status", "Card C status".
 * 
 * Each menu button opens a dropdown with three options, each with a small colored dot:
 * "Healthy" (green dot), "Warning" (yellow dot), "Critical" (red dot).
 * 
 * Above the toolbar there is a "Reference status color" swatch (yellow = Warning).
 * The task is to set Card B status to whichever option matches the reference swatch color.
 * 
 * Initial state: all three cards are set to Healthy.
 * Success: For "Card B status", the selected status matches the reference (Warning).
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text, Box, Grid, Badge, Stack } from '@mantine/core';
import { IconChevronDown, IconCircleFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const statusOptions = [
  { key: 'healthy', label: 'Healthy', color: 'green' },
  { key: 'warning', label: 'Warning', color: 'yellow' },
  { key: 'critical', label: 'Critical', color: 'red' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [cardAStatus, setCardAStatus] = useState('Healthy');
  const [cardBStatus, setCardBStatus] = useState('Healthy');
  const [cardCStatus, setCardCStatus] = useState('Healthy');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (cardBStatus === 'Warning' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [cardBStatus, successTriggered, onSuccess]);

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.label === status)?.color || 'gray';
  };

  const renderStatusMenu = (
    cardName: string,
    currentStatus: string,
    setStatus: (status: string) => void,
    testId: string
  ) => (
    <Menu>
      <Menu.Target>
        <Button
          variant="default"
          size="xs"
          rightSection={<IconChevronDown size={14} />}
          data-testid={testId}
        >
          {cardName}: {currentStatus}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {statusOptions.map(option => (
          <Menu.Item
            key={option.key}
            onClick={() => setStatus(option.label)}
            leftSection={<IconCircleFilled size={12} style={{ color: option.color === 'yellow' ? '#f59f00' : option.color }} />}
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <Box style={{ width: '100%', maxWidth: 800 }}>
      <Grid>
        {/* Main dashboard area with cards */}
        <Grid.Col span={8}>
          <Stack gap="md">
            <Card shadow="xs" padding="sm" withBorder>
              <Text fw={500} mb="xs">Card A</Text>
              <Badge color={getStatusColor(cardAStatus)}>{cardAStatus}</Badge>
            </Card>
            
            <Card shadow="xs" padding="sm" withBorder>
              <Text fw={500} mb="xs">Card B</Text>
              <Badge color={getStatusColor(cardBStatus)}>{cardBStatus}</Badge>
            </Card>
            
            <Card shadow="xs" padding="sm" withBorder>
              <Text fw={500} mb="xs">Card C</Text>
              <Badge color={getStatusColor(cardCStatus)}>{cardCStatus}</Badge>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Status toolbar on the right */}
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" withBorder>
            <Text fw={600} size="sm" mb="md">Status Controls</Text>
            
            {/* Reference color swatch */}
            <Box mb="md">
              <Text size="xs" c="dimmed" mb={4}>Reference status color:</Text>
              <Box
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: '#f59f00', // Yellow = Warning
                  borderRadius: 4,
                  border: '1px solid #dee2e6',
                }}
                data-ref-id="status_color_ref_1"
              />
            </Box>

            <Stack gap="sm">
              {renderStatusMenu('Card A status', cardAStatus, setCardAStatus, 'menu-button-card-a-status')}
              {renderStatusMenu('Card B status', cardBStatus, setCardBStatus, 'menu-button-card-b-status')}
              {renderStatusMenu('Card C status', cardCStatus, setCardCStatus, 'menu-button-card-c-status')}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
