'use client';

/**
 * switch-mantine-T09: Scroll settings and disable Auto-save drafts
 *
 * Layout: settings_panel anchored near the top-left of the viewport with an internal scroll area.
 * Spacing: compact; Scale: small — switches are rendered in Mantine size="xs" with reduced padding between rows.
 * The panel contains several sections ("Editor", "Drafts", "Sharing"), each with multiple switches (at least 3 total switch instances in the panel).
 * The target is in the "Drafts" section labeled "Auto-save drafts".
 * Initial state: "Auto-save drafts" is ON.
 * Clutter: medium — section headings and a few text links (e.g., "Learn more") are present; only the target switch state is evaluated.
 * Feedback: toggling updates immediately; no confirmation modal.
 */

import React, { useState } from 'react';
import { Card, Switch, Text, Anchor, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface SwitchState {
  lineNumbers: boolean;
  wordWrap: boolean;
  autoIndent: boolean;
  autoSaveDrafts: boolean;
  showDraftHistory: boolean;
  allowSharing: boolean;
  publicByDefault: boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [switches, setSwitches] = useState<SwitchState>({
    lineNumbers: true,
    wordWrap: false,
    autoIndent: true,
    autoSaveDrafts: true,
    showDraftHistory: false,
    allowSharing: true,
    publicByDefault: false,
  });

  const handleChange = (key: keyof SwitchState, value: boolean) => {
    setSwitches(prev => ({ ...prev, [key]: value }));
    if (key === 'autoSaveDrafts' && !value) {
      onSuccess();
    }
  };

  const SwitchRow = ({ 
    label, 
    switchKey, 
    testId 
  }: { 
    label: string; 
    switchKey: keyof SwitchState;
    testId: string;
  }) => (
    <div style={{ padding: '4px 0' }}>
      <Switch
        size="xs"
        checked={switches[switchKey]}
        onChange={(e) => handleChange(switchKey, e.currentTarget.checked)}
        label={label}
        data-testid={testId}
        aria-checked={switches[switchKey]}
      />
    </div>
  );

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 320, maxHeight: 350, overflow: 'hidden' }}>
      <Text fw={500} size="md" mb="sm">Settings</Text>
      <ScrollArea h={260}>
        <Text fw={500} size="xs" c="dimmed" mb="xs">Editor</Text>
        <SwitchRow label="Line numbers" switchKey="lineNumbers" testId="line-numbers-switch" />
        <SwitchRow label="Word wrap" switchKey="wordWrap" testId="word-wrap-switch" />
        <SwitchRow label="Auto indent" switchKey="autoIndent" testId="auto-indent-switch" />
        
        <Text fw={500} size="xs" c="dimmed" mt="md" mb="xs">Drafts</Text>
        <SwitchRow label="Auto-save drafts" switchKey="autoSaveDrafts" testId="auto-save-drafts-switch" />
        <SwitchRow label="Show draft history" switchKey="showDraftHistory" testId="show-draft-history-switch" />
        
        <Text fw={500} size="xs" c="dimmed" mt="md" mb="xs">Sharing</Text>
        <SwitchRow label="Allow sharing" switchKey="allowSharing" testId="allow-sharing-switch" />
        <SwitchRow label="Public by default" switchKey="publicByDefault" testId="public-by-default-switch" />
        
        <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
          <Anchor size="xs">Learn more</Anchor>
        </div>
      </ScrollArea>
    </Card>
  );
}
