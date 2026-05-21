'use client';

/**
 * link-mantine-T08: Reset the GitHub integration in a cluttered integrations form
 * 
 * setup_description:
 * A form_section layout titled "Integrations" presents three stacked integration panels:
 * "Slack", "GitHub", and "Jira". Each panel contains several read-only fields and
 * toggle-like status indicators, plus a right-aligned Mantine Anchor link in the panel
 * header labeled "Restore defaults".
 * 
 * Spacing is compact. Clutter is high due to many labeled rows and status chips.
 * 
 * Initial state: GitHub is "Customized" and its Restore defaults link is enabled.
 * Slack and Jira are already at default and their links are disabled.
 * 
 * success_trigger:
 * - The GitHub Restore defaults link (data-testid="reset-github") was activated.
 * - After activation, the GitHub reset link has aria-disabled="true".
 * - The GitHub section status reads "Default".
 */

import React, { useState } from 'react';
import { Card, Text, Anchor, Box, Badge, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface IntegrationProps {
  title: string;
  status: 'Customized' | 'Default';
  onReset: () => void;
  disabled: boolean;
  testId: string;
  fields: { label: string; value: string }[];
}

function IntegrationPanel({ title, status, onReset, disabled, testId, fields }: IntegrationProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onReset();
    }
  };

  return (
    <Box 
      mb="sm"
      style={{ 
        border: '1px solid var(--mantine-color-gray-3)', 
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <Box 
        p="xs"
        style={{
          backgroundColor: 'var(--mantine-color-gray-0)',
          borderBottom: '1px solid var(--mantine-color-gray-3)',
        }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <Text fw={500} size="sm">{title}</Text>
            <Badge 
              color={status === 'Customized' ? 'blue' : 'gray'} 
              size="sm"
              data-testid={`${testId}-status`}
            >
              {status}
            </Badge>
          </Group>
          <Anchor
            component="button"
            onClick={handleClick}
            data-testid={testId}
            aria-disabled={disabled}
            size="sm"
            c={disabled ? 'dimmed' : undefined}
            style={{ 
              cursor: disabled ? 'not-allowed' : 'pointer',
              pointerEvents: disabled ? 'none' : 'auto',
            }}
          >
            Restore defaults
          </Anchor>
        </Group>
      </Box>
      <Box p="xs">
        {fields.map((field, index) => (
          <Group key={index} justify="space-between" py={4}>
            <Text size="xs" c="dimmed">{field.label}</Text>
            <Text size="xs">{field.value}</Text>
          </Group>
        ))}
      </Box>
    </Box>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [githubStatus, setGithubStatus] = useState<'Customized' | 'Default'>('Customized');

  const handleGithubReset = () => {
    if (githubStatus === 'Customized') {
      setGithubStatus('Default');
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">
        Integrations
      </Text>
      
      <IntegrationPanel
        title="Slack"
        status="Default"
        onReset={() => {}}
        disabled={true}
        testId="reset-slack"
        fields={[
          { label: 'Webhook URL', value: 'Not set' },
          { label: 'Channel', value: '#general' },
        ]}
      />
      
      <IntegrationPanel
        title="GitHub"
        status={githubStatus}
        onReset={handleGithubReset}
        disabled={githubStatus === 'Default'}
        testId="reset-github"
        fields={[
          { label: 'Repository', value: 'my-org/my-repo' },
          { label: 'Branch', value: 'main' },
          { label: 'Auto-sync', value: 'Enabled' },
        ]}
      />
      
      <IntegrationPanel
        title="Jira"
        status="Default"
        onReset={() => {}}
        disabled={true}
        testId="reset-jira"
        fields={[
          { label: 'Project', value: 'Not configured' },
          { label: 'Sync status', value: 'Disabled' },
        ]}
      />
    </Card>
  );
}
