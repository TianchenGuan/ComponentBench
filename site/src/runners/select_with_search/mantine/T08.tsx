'use client';

/**
 * select_with_search-mantine-T08: Set Tertiary KPI on a dashboard (3 selects)
 *
 * Layout: dashboard with several KPI cards and a filter bar (clutter medium).
 * In the filter bar there are three same-type Mantine searchable Selects:
 *  - "Primary KPI" (initial: Revenue)
 *  - "Secondary KPI" (initial: Conversion Rate)
 *  - "Tertiary KPI" (initial: Customer Satisfaction) ← TARGET
 * Each Select opens a dropdown and supports searching across KPI names.
 * Options include a moderately long list (~30) of KPI metrics, including:
 *  Revenue, Gross Margin, Conversion Rate, Click-through Rate, Customer Satisfaction, Net Promoter Score, Churn Rate, Average Order Value, Support Tickets.
 * Success depends only on the selected value of "Tertiary KPI"; no Apply/Save step is required.
 *
 * Success: The selected value of the "Tertiary KPI" Select equals "Net Promoter Score".
 */

import React, { useState } from 'react';
import { Card, Text, Select, Grid, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const kpiOptions = [
  { value: 'Revenue', label: 'Revenue' },
  { value: 'Gross Margin', label: 'Gross Margin' },
  { value: 'Net Income', label: 'Net Income' },
  { value: 'Operating Costs', label: 'Operating Costs' },
  { value: 'Conversion Rate', label: 'Conversion Rate' },
  { value: 'Click-through Rate', label: 'Click-through Rate' },
  { value: 'Bounce Rate', label: 'Bounce Rate' },
  { value: 'Page Views', label: 'Page Views' },
  { value: 'Session Duration', label: 'Session Duration' },
  { value: 'Customer Satisfaction', label: 'Customer Satisfaction' },
  { value: 'Net Promoter Score', label: 'Net Promoter Score' },
  { value: 'Customer Effort Score', label: 'Customer Effort Score' },
  { value: 'Churn Rate', label: 'Churn Rate' },
  { value: 'Retention Rate', label: 'Retention Rate' },
  { value: 'Average Order Value', label: 'Average Order Value' },
  { value: 'Customer Lifetime Value', label: 'Customer Lifetime Value' },
  { value: 'Support Tickets', label: 'Support Tickets' },
  { value: 'First Response Time', label: 'First Response Time' },
  { value: 'Resolution Time', label: 'Resolution Time' },
  { value: 'Employee Satisfaction', label: 'Employee Satisfaction' },
  { value: 'Monthly Active Users', label: 'Monthly Active Users' },
  { value: 'Daily Active Users', label: 'Daily Active Users' },
  { value: 'New Users', label: 'New Users' },
  { value: 'Return Visitors', label: 'Return Visitors' },
  { value: 'Lead Generation', label: 'Lead Generation' },
  { value: 'Sales Pipeline', label: 'Sales Pipeline' },
  { value: 'Win Rate', label: 'Win Rate' },
  { value: 'Deal Size', label: 'Deal Size' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryKpi, setPrimaryKpi] = useState<string | null>('Revenue');
  const [secondaryKpi, setSecondaryKpi] = useState<string | null>('Conversion Rate');
  const [tertiaryKpi, setTertiaryKpi] = useState<string | null>('Customer Satisfaction');

  const handleTertiaryChange = (newValue: string | null) => {
    setTertiaryKpi(newValue);
    if (newValue === 'Net Promoter Score') {
      onSuccess();
    }
  };

  return (
    <Box style={{ width: '100%' }}>
      <Text fw={600} size="xl" mb="md">KPI Dashboard</Text>
      
      {/* Filter bar */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Group grow>
          <Select
            data-testid="primary-kpi-select"
            label="Primary KPI"
            searchable
            data={kpiOptions}
            value={primaryKpi}
            onChange={setPrimaryKpi}
          />
          <Select
            data-testid="secondary-kpi-select"
            label="Secondary KPI"
            searchable
            data={kpiOptions}
            value={secondaryKpi}
            onChange={setSecondaryKpi}
          />
          <Select
            data-testid="tertiary-kpi-select"
            label="Tertiary KPI"
            searchable
            data={kpiOptions}
            value={tertiaryKpi}
            onChange={handleTertiaryChange}
          />
        </Group>
      </Card>

      {/* KPI cards - clutter */}
      <Grid>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">Revenue</Text>
            <Text fw={700} size="xl">$124,500</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">Conversion Rate</Text>
            <Text fw={700} size="xl">3.2%</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">Customer Satisfaction</Text>
            <Text fw={700} size="xl">4.5/5</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
