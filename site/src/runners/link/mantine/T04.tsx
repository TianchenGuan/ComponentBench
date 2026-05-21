'use client';

/**
 * link-mantine-T04: Select the Invoices section from a 5-link row (Mantine)
 * 
 * setup_description:
 * A centered isolated card titled "Account Sections" contains a horizontal row of five
 * Mantine Anchor links used as in-card navigation: "Overview", "Usage", "Invoices",
 * "Payments", and "Team".
 * 
 * Initial state: Overview is active (aria-current="page" on the Overview Anchor) and
 * the panel below shows "Overview". Selecting another Anchor updates aria-current="page"
 * and the visible panel heading.
 * 
 * success_trigger:
 * - The "Invoices" Anchor (data-testid="nav-invoices") was activated.
 * - The "Invoices" Anchor has aria-current="page".
 * - The active panel key equals "invoices".
 */

import React, { useState } from 'react';
import { Card, Text, Anchor, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

type Tab = 'overview' | 'usage' | 'invoices' | 'payments' | 'team';

const tabs: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'usage', label: 'Usage' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'payments', label: 'Payments' },
  { key: 'team', label: 'Team' },
];

const panelContent: Record<Tab, string> = {
  overview: 'Your account overview and summary statistics.',
  usage: 'Monthly usage breakdown and analytics.',
  invoices: 'View and download your invoices.',
  payments: 'Manage payment methods and history.',
  team: 'Manage team members and permissions.',
};

export default function T04({ onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleTabClick = (tab: Tab) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
    if (tab === 'invoices') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={500} size="lg" mb="md">
        Account Sections
      </Text>
      
      <Group gap="xs" mb="lg">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.key}>
            <Anchor
              href="#"
              onClick={handleTabClick(tab.key)}
              data-testid={`nav-${tab.key}`}
              aria-current={activeTab === tab.key ? 'page' : undefined}
              fw={activeTab === tab.key ? 600 : 400}
              td={activeTab === tab.key ? 'underline' : 'none'}
            >
              {tab.label}
            </Anchor>
            {index < tabs.length - 1 && (
              <Text c="dimmed">|</Text>
            )}
          </React.Fragment>
        ))}
      </Group>
      
      <Box p="md" style={{ backgroundColor: 'var(--mantine-color-gray-1)', borderRadius: 4 }}>
        <Text fw={500} size="lg" data-testid="panel-heading" mb="xs">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Text>
        <Text size="sm">{panelContent[activeTab]}</Text>
      </Box>
    </Card>
  );
}
