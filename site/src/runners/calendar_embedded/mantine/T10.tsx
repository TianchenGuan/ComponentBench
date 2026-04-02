'use client';

/**
 * calendar_embedded-mantine-T10: Pick a date in Team C and apply changes (3 instances)
 *
 * Layout: dashboard (light theme, comfortable spacing, default scale) with high clutter.
 * The page is a "Team scheduling" dashboard with a toolbar (buttons like Export, Refresh, Help) and a sidebar of navigation links.
 * In the main area there are three calendar cards in a row, each containing a Mantine Calendar:
 *   - Team A
 *   - Team B
 *   - Team C
 * All three calendars start on February 2027 and have no committed selection.
 * Interaction is staged per team: clicking a day sets a pending selection highlight, but the team's committed value updates only when the global footer button "Apply changes" is clicked.
 * The footer contains two buttons: "Discard" and "Apply changes".
 * Under each calendar is a small readout "Applied date:" that shows the committed date for that team (initially "(none)"). It updates only after Apply changes.
 * Only Team C's applied date is the target for success; Team A and Team B must remain unchanged.
 *
 * Success: Team C committed/applied date equals 2027-02-01.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Group, Stack, Box, NavLink } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { IconDownload, IconRefresh, IconHelp, IconHome, IconSettings } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [pendingA, setPendingA] = useState<Date | null>(null);
  const [pendingB, setPendingB] = useState<Date | null>(null);
  const [pendingC, setPendingC] = useState<Date | null>(null);
  const [appliedA, setAppliedA] = useState<Date | null>(null);
  const [appliedB, setAppliedB] = useState<Date | null>(null);
  const [appliedC, setAppliedC] = useState<Date | null>(null);

  useEffect(() => {
    if (
      appliedC &&
      dayjs(appliedC).format('YYYY-MM-DD') === '2027-02-01' &&
      appliedA === null &&
      appliedB === null
    ) {
      onSuccess();
    }
  }, [appliedA, appliedB, appliedC, onSuccess]);

  const handleApply = () => {
    if (pendingA) {
      setAppliedA(pendingA);
      setPendingA(null);
    }
    if (pendingB) {
      setAppliedB(pendingB);
      setPendingB(null);
    }
    if (pendingC) {
      setAppliedC(pendingC);
      setPendingC(null);
    }
  };

  const handleDiscard = () => {
    setPendingA(null);
    setPendingB(null);
    setPendingC(null);
  };

  const renderCalendar = (
    label: string,
    pending: Date | null,
    setPending: (d: Date | null) => void,
    applied: Date | null,
    testId: string
  ) => (
    <Box data-testid={testId}>
      <Text fw={600} mb="xs">{label}</Text>
      <Calendar
        defaultDate={new Date(2027, 1, 1)}
        getDayProps={(date) => ({
          selected: pending ? dayjs(date).isSame(pending, 'day') : false,
          onClick: () => setPending(date),
        })}
      />
      <Text size="xs" mt="xs">
        <Text component="span" fw={500}>Applied date: </Text>
        <Text component="span" data-testid={`${testId}-applied`}>
          {applied ? dayjs(applied).format('YYYY-MM-DD') : '(none)'}
        </Text>
      </Text>
      {pending && (
        <Text size="xs" c="dimmed">
          Pending: {dayjs(pending).format('YYYY-MM-DD')}
        </Text>
      )}
    </Box>
  );

  return (
    <Box style={{ width: 900 }} data-testid="dashboard">
      {/* Toolbar */}
      <Card shadow="sm" padding="sm" radius="md" withBorder mb="md">
        <Group justify="space-between">
          <Text fw={600}>Team scheduling</Text>
          <Group gap="xs">
            <Button variant="subtle" size="xs" leftSection={<IconDownload size={14} />} data-testid="export-btn">
              Export
            </Button>
            <Button variant="subtle" size="xs" leftSection={<IconRefresh size={14} />} data-testid="refresh-btn">
              Refresh
            </Button>
            <Button variant="subtle" size="xs" leftSection={<IconHelp size={14} />} data-testid="help-btn">
              Help
            </Button>
          </Group>
        </Group>
      </Card>

      <Box style={{ display: 'flex', gap: 16 }}>
        {/* Sidebar */}
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 160 }}>
          <Stack gap="xs">
            <NavLink label="Home" leftSection={<IconHome size={16} />} data-testid="nav-home" />
            <NavLink label="Settings" leftSection={<IconSettings size={16} />} data-testid="nav-settings" />
          </Stack>
        </Card>

        {/* Main content */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          <Group align="flex-start" gap="md" mb="md">
            {renderCalendar('Team A', pendingA, setPendingA, appliedA, 'calendar-team-a')}
            {renderCalendar('Team B', pendingB, setPendingB, appliedB, 'calendar-team-b')}
            {renderCalendar('Team C', pendingC, setPendingC, appliedC, 'calendar-team-c')}
          </Group>

          {/* Footer buttons */}
          <Box style={{ borderTop: '1px solid #e0e0e0', paddingTop: 16 }}>
            <Group>
              <Button variant="default" onClick={handleDiscard} data-testid="discard-button">
                Discard
              </Button>
              <Button onClick={handleApply} data-testid="apply-button">
                Apply changes
              </Button>
            </Group>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
