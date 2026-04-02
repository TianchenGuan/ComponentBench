'use client';

/**
 * link-mui-T04: Select the Security section link from a 4-link nav row
 * 
 * setup_description:
 * A centered isolated card titled "Account Navigation" contains a horizontal navigation
 * row of four Material UI Link components: "Overview", "Billing", "Security", and
 * "Notifications". The links are placed close together and share the same typography style.
 * 
 * Initial state: "Overview" is active (aria-current="page" on the Overview link) and
 * the content panel below shows "Overview". Activating a different link updates the
 * active styling and sets aria-current="page" on the selected link.
 * 
 * success_trigger:
 * - The "Security" link (data-testid="nav-security") was activated.
 * - The "Security" link has aria-current="page".
 * - The active panel key equals "security".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Link, Typography, Box, Stack, Divider } from '@mui/material';
import type { TaskComponentProps } from '../types';

type Tab = 'overview' | 'billing' | 'security' | 'notifications';

const tabs: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'billing', label: 'Billing' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
];

const panelContent: Record<Tab, string> = {
  overview: 'Your account overview and summary statistics.',
  billing: 'Manage your billing information and payment methods.',
  security: 'Review security settings and enable two-factor authentication.',
  notifications: 'Configure your notification preferences.',
};

export default function T04({ onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleTabClick = (tab: Tab) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
    if (tab === 'security') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Account Navigation" />
      <CardContent>
        <Stack 
          direction="row" 
          spacing={1} 
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ mb: 3 }}
        >
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href="#"
              onClick={handleTabClick(tab.key)}
              data-testid={`nav-${tab.key}`}
              aria-current={activeTab === tab.key ? 'page' : undefined}
              sx={{ 
                cursor: 'pointer',
                fontWeight: activeTab === tab.key ? 600 : 400,
                textDecoration: activeTab === tab.key ? 'underline' : 'none',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </Stack>
        
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6" data-testid="panel-heading" sx={{ mb: 1 }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Typography>
          <Typography variant="body2">
            {panelContent[activeTab]}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
