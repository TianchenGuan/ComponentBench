'use client';

/**
 * tabs-mantine-T08: Compact small scrollable list: find November
 *
 * Layout: isolated_card centered titled "Months".
 * Universal variations: spacing is compact and component scale is small.
 * Component: Mantine Tabs (default variant) with 12 tabs labeled "January" through "December".
 * Initial state: "January" is active.
 * The card width is constrained and Tabs.List is styled with horizontal overflow (overflow-x: auto), so not all month tabs are visible at once.
 * To reach later months, the user must scroll the tab strip itself (not the page) and then select the target tab.
 * No other UI elements on the page.
 * Success: Active tab is "November" (value: november).
 */

import React, { useState } from 'react';
import { Tabs, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const months = [
  { key: 'january', label: 'January' },
  { key: 'february', label: 'February' },
  { key: 'march', label: 'March' },
  { key: 'april', label: 'April' },
  { key: 'may', label: 'May' },
  { key: 'june', label: 'June' },
  { key: 'july', label: 'July' },
  { key: 'august', label: 'August' },
  { key: 'september', label: 'September' },
  { key: 'october', label: 'October' },
  { key: 'november', label: 'November' },
  { key: 'december', label: 'December' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('january');

  const handleChange = (value: string | null) => {
    setActiveTab(value);
    if (value === 'november') {
      onSuccess();
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder 
      style={{ width: 350 }}
    >
      <Text fw={600} size="md" mb="sm">
        Months
      </Text>
      <Tabs value={activeTab} onChange={handleChange}>
        <div style={{ overflowX: 'auto', marginBottom: 8 }}>
          <Tabs.List style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
            {months.map((month) => (
              <Tabs.Tab 
                key={month.key} 
                value={month.key}
                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
              >
                {month.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </div>

        {months.map((month) => (
          <Tabs.Panel key={month.key} value={month.key} pt="sm">
            <Text size="sm">{month.label} panel content</Text>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Card>
  );
}
