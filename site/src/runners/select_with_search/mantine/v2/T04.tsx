'use client';

/**
 * select_with_search-mantine-v2-T04: Three KPI selectors in cluttered dashboard card
 *
 * Dashboard panel with 3 searchable Mantine Select controls:
 * - Primary KPI — Revenue
 * - Secondary KPI — Customer Satisfaction
 * - Tertiary KPI — (empty)
 * Options: Revenue, Customer Satisfaction, Net Promoter Score, Retention, Churn.
 * withCheckIcon={false}. High clutter. "Save KPI card" commits.
 * Success: Tertiary KPI = "Net Promoter Score", others unchanged, Save KPI card clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Button, Group, Badge, Divider, SimpleGrid } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const kpiOptions = [
  { value: 'Revenue', label: 'Revenue' },
  { value: 'Customer Satisfaction', label: 'Customer Satisfaction' },
  { value: 'Net Promoter Score', label: 'Net Promoter Score' },
  { value: 'Retention', label: 'Retention' },
  { value: 'Churn', label: 'Churn' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primaryKpi, setPrimaryKpi] = useState<string | null>('Revenue');
  const [secondaryKpi, setSecondaryKpi] = useState<string | null>('Customer Satisfaction');
  const [tertiaryKpi, setTertiaryKpi] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      tertiaryKpi === 'Net Promoter Score' &&
      primaryKpi === 'Revenue' &&
      secondaryKpi === 'Customer Satisfaction'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, tertiaryKpi, primaryKpi, secondaryKpi, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">KPI Dashboard</Text>
          <Group gap="xs">
            <Badge size="sm" color="green">Live</Badge>
            <Badge size="sm" variant="outline">Q4 2025</Badge>
          </Group>
        </Group>

        <SimpleGrid cols={3} spacing="sm" mb="md">
          <div style={{ textAlign: 'center' }}>
            <Text size="xl" fw={700}>$2.4M</Text>
            <Text size="xs" c="dimmed">Revenue MTD</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="xl" fw={700}>87%</Text>
            <Text size="xs" c="dimmed">Satisfaction</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="xl" fw={700}>4.2%</Text>
            <Text size="xs" c="dimmed">Churn Rate</Text>
          </div>
        </SimpleGrid>

        <Divider mb="md" />

        <SimpleGrid cols={3} spacing="sm">
          <Select
            label="Primary KPI"
            searchable
            withCheckIcon={false}
            size="xs"
            data={kpiOptions}
            value={primaryKpi}
            onChange={(val) => { setPrimaryKpi(val); setSaved(false); }}
          />
          <Select
            label="Secondary KPI"
            searchable
            withCheckIcon={false}
            size="xs"
            data={kpiOptions}
            value={secondaryKpi}
            onChange={(val) => { setSecondaryKpi(val); setSaved(false); }}
          />
          <Select
            label="Tertiary KPI"
            searchable
            withCheckIcon={false}
            size="xs"
            data={kpiOptions}
            value={tertiaryKpi}
            onChange={(val) => { setTertiaryKpi(val); setSaved(false); }}
          />
        </SimpleGrid>

        <Divider my="md" />

        <Group justify="space-between">
          <Group gap="xs">
            <Badge size="xs" variant="light" color="blue">Auto-refresh</Badge>
            <Badge size="xs" variant="light" color="gray">v2.4</Badge>
            <Text size="xs" c="dimmed">Last sync: 2m ago</Text>
          </Group>
          <Button size="sm" onClick={() => setSaved(true)}>Save KPI card</Button>
        </Group>
      </Card>
    </div>
  );
}
