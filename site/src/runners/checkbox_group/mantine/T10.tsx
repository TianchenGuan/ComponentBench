'use client';

/**
 * checkbox_group-mantine-T10: Set incident notifications in a drawer (two groups) and save
 *
 * Scene: light theme; comfortable spacing; a drawer panel flow anchored toward the bottom-left; instances=2.
 * Mantine settings page (light theme). Near the bottom-left is a button "Advanced notifications".
 * Clicking "Advanced notifications" opens a left-side drawer (Mantine Drawer).
 * Inside the drawer are TWO Checkbox.Group instances:
 * 1) "Incident notifications" (target): Outages (unchecked), Security incidents (checked), Billing failures (unchecked), Maintenance windows (unchecked)
 * 2) "Product announcements" (distractor): New features (checked), Webinars (unchecked), Surveys (unchecked)
 * At the bottom: "Save" (primary) and "Close" (secondary)
 * Success: In the 'Incident notifications' group, exactly Outages and Maintenance windows are checked, and Save is clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Button, Drawer, Checkbox, Stack, Group, Box, Divider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const incidentOptions = ['Outages', 'Security incidents', 'Billing failures', 'Maintenance windows'];
const productOptions = ['New features', 'Webinars', 'Surveys'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [incidentNotifications, setIncidentNotifications] = useState<string[]>(['Security incidents']);
  const [productAnnouncements, setProductAnnouncements] = useState<string[]>(['New features']);
  const hasSucceeded = useRef(false);

  const handleSave = () => {
    const targetSet = new Set(['Outages', 'Maintenance windows']);
    const currentSet = new Set(incidentNotifications);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
    setOpened(false);
  };

  const handleClose = () => {
    // Reset to initial state
    setIncidentNotifications(['Security incidents']);
    setProductAnnouncements(['New features']);
    setOpened(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">Settings</Text>
        <Text size="sm" c="dimmed" mb="md">
          Configure advanced notification preferences for your team.
        </Text>
        <Button variant="outline" onClick={() => setOpened(true)}>
          Advanced notifications
        </Button>
      </Card>

      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Advanced notifications"
        position="left"
        size="sm"
      >
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box style={{ flex: 1 }}>
            {/* Target: Incident notifications */}
            <Text fw={500} size="sm" mb="xs">Incident notifications</Text>
            <Checkbox.Group
              data-testid="cg-incident-notifications"
              value={incidentNotifications}
              onChange={setIncidentNotifications}
              mb="lg"
            >
              <Stack gap="xs">
                {incidentOptions.map(option => (
                  <Checkbox key={option} value={option} label={option} />
                ))}
              </Stack>
            </Checkbox.Group>

            <Divider my="md" />

            {/* Distractor: Product announcements */}
            <Text fw={500} size="sm" mb="xs">Product announcements</Text>
            <Checkbox.Group
              data-testid="cg-product-announcements"
              value={productAnnouncements}
              onChange={setProductAnnouncements}
            >
              <Stack gap="xs">
                {productOptions.map(option => (
                  <Checkbox key={option} value={option} label={option} />
                ))}
              </Stack>
            </Checkbox.Group>
          </Box>

          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" onClick={handleClose}>Close</Button>
            <Button onClick={handleSave} data-testid="btn-save">Save</Button>
          </Group>
        </Box>
      </Drawer>
    </>
  );
}
