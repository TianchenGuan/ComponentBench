'use client';

/**
 * collapsible_disclosure-mantine-T10: Settings panel: expand Advanced options (Collapse component)
 * 
 * This task uses Mantine's Collapse component (single disclosure region) inside a settings panel.
 * 
 * - Layout: settings_panel.
 * - The panel includes typical form controls as distractors (text inputs, toggles, and a Save button), but none are required for success.
 * - Target component: a Mantine Collapse region labeled "Advanced options".
 *   - The Collapse content is controlled by a small button labeled "Show advanced" located near the top-right of the panel section.
 * - Initial state: the Collapse region is collapsed (Advanced options content not visible).
 * - Success is achieved when the Collapse region is expanded and its content is visible.
 * 
 * Success: "Advanced options" Collapse region is expanded
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TextInput, Switch, Button, Group, Box, Collapse, Stack, Divider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [formState, setFormState] = useState({
    siteName: 'My Website',
    siteUrl: 'https://example.com',
    analytics: true,
    caching: true,
  });

  useEffect(() => {
    if (opened) {
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Settings panel</Text>
        <Button 
          variant="subtle" 
          size="xs"
          onClick={() => setOpened(o => !o)}
          data-testid="toggle-advanced-button"
        >
          {opened ? 'Hide advanced' : 'Show advanced'}
        </Button>
      </Group>
      
      <Stack gap="md">
        <TextInput 
          label="Site name" 
          value={formState.siteName}
          onChange={(e) => setFormState(prev => ({ ...prev, siteName: e.target.value }))}
        />
        
        <TextInput 
          label="Site URL" 
          value={formState.siteUrl}
          onChange={(e) => setFormState(prev => ({ ...prev, siteUrl: e.target.value }))}
        />
        
        <Switch 
          label="Enable analytics" 
          checked={formState.analytics}
          onChange={(e) => setFormState(prev => ({ ...prev, analytics: e.currentTarget.checked }))}
        />
        
        <Switch 
          label="Enable caching" 
          checked={formState.caching}
          onChange={(e) => setFormState(prev => ({ ...prev, caching: e.currentTarget.checked }))}
        />

        <Collapse in={opened} data-testid="advanced-options-collapse">
          <Box 
            style={{ 
              padding: 16, 
              background: '#f8f9fa', 
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            <Text fw={500} mb="sm">Advanced options</Text>
            <Stack gap="sm">
              <TextInput label="Custom domain" placeholder="www.custom.com" size="sm" />
              <TextInput label="API endpoint" placeholder="https://api.example.com" size="sm" />
              <Switch label="Developer mode" size="sm" />
              <Switch label="Debug logging" size="sm" />
            </Stack>
          </Box>
        </Collapse>

        <Divider />

        <Group justify="flex-end">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </Group>
      </Stack>
    </Card>
  );
}
