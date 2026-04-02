'use client';

/**
 * link-mui-T07: Reset Email Notifications using the correct reset link (compact settings panel)
 * 
 * setup_description:
 * A settings_panel layout titled "Notification Settings" contains two stacked sections
 * with compact spacing: "Email notifications" and "Push notifications".
 * 
 * Each section header includes a right-aligned Material UI Link labeled "Reset". The two
 * links look identical and are close together vertically due to compact spacing.
 * 
 * Initial state: Email notifications are marked "Customized" and its Reset link is enabled;
 * Push notifications are already default and its Reset link is disabled.
 * 
 * success_trigger:
 * - The Email notifications Reset link (data-testid="reset-email") was activated.
 * - After activation, the Email Reset link has aria-disabled="true".
 * - The Email section status reads "Default".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Link, Typography, Box, Chip, Divider } from '@mui/material';
import type { TaskComponentProps } from '../types';

interface SectionProps {
  title: string;
  status: 'Customized' | 'Default';
  onReset: () => void;
  disabled: boolean;
  testId: string;
  settings: { label: string; value: string }[];
}

function SettingsSection({ title, status, onReset, disabled, testId, settings }: SectionProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onReset();
    }
  };

  return (
    <Box sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 1.5,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2">{title}</Typography>
          <Chip 
            label={status} 
            size="small" 
            color={status === 'Customized' ? 'primary' : 'default'}
            data-testid={`${testId}-status`}
          />
        </Box>
        <Link
          component="button"
          onClick={handleClick}
          data-testid={testId}
          aria-disabled={disabled}
          sx={{ 
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: disabled ? 'text.disabled' : 'primary.main',
            pointerEvents: disabled ? 'none' : 'auto',
          }}
        >
          Reset
        </Link>
      </Box>
      <Box sx={{ p: 1.5 }}>
        {settings.map((setting, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              py: 0.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">{setting.label}</Typography>
            <Typography variant="body2">{setting.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [emailStatus, setEmailStatus] = useState<'Customized' | 'Default'>('Customized');

  const handleEmailReset = () => {
    if (emailStatus === 'Customized') {
      setEmailStatus('Default');
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Notification Settings" sx={{ pb: 1 }} />
      <CardContent sx={{ pt: 0 }}>
        <SettingsSection
          title="Email notifications"
          status={emailStatus}
          onReset={handleEmailReset}
          disabled={emailStatus === 'Default'}
          testId="reset-email"
          settings={[
            { label: 'Digest frequency', value: 'Daily' },
            { label: 'Marketing emails', value: 'Enabled' },
          ]}
        />
        <SettingsSection
          title="Push notifications"
          status="Default"
          onReset={() => {}}
          disabled={true}
          testId="reset-push"
          settings={[
            { label: 'Alerts', value: 'All' },
            { label: 'Sound', value: 'Default' },
          ]}
        />
      </CardContent>
    </Card>
  );
}
