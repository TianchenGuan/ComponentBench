'use client';

/**
 * data_table_sortable-mantine-T27: Dark dashboard - sort Pipelines by Win probability high→low (3 tables)
 *
 * High-clutter, dark-theme dashboard with three Mantine composite sortable tables.
 * - Tables: "Pipelines" (target), "Deals" (distractor), "Accounts" (distractor).
 * - Each has a percentage column, increasing confusability.
 * - Initial state: all tables unsorted.
 * - Placement: top_left.
 *
 * Success: Pipelines Win probability sorted descending; others unchanged.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, UnstyledButton, Group, Center, NavLink, Box, Badge, Stack } from '@mantine/core';
import { IconChevronUp, IconChevronDown, IconSelector, IconHome, IconChartBar, IconUsers } from '@tabler/icons-react';
import type { TaskComponentProps, SortModel } from '../types';

interface PipelineData {
  id: string;
  pipeline: string;
  stage: string;
  winProbability: number;
  value: number;
}

interface DealData {
  id: string;
  deal: string;
  owner: string;
  discount: number;
  status: string;
}

interface AccountData {
  id: string;
  account: string;
  industry: string;
  churnRisk: number;
  arr: number;
}

const pipelinesData: PipelineData[] = [
  { id: '1', pipeline: 'Enterprise Q1', stage: 'Negotiation', winProbability: 75, value: 250000 },
  { id: '2', pipeline: 'SMB Growth', stage: 'Proposal', winProbability: 45, value: 45000 },
  { id: '3', pipeline: 'Strategic', stage: 'Closing', winProbability: 90, value: 500000 },
  { id: '4', pipeline: 'Expansion', stage: 'Discovery', winProbability: 25, value: 80000 },
  { id: '5', pipeline: 'Renewal Q2', stage: 'Negotiation', winProbability: 85, value: 150000 },
];

const dealsData: DealData[] = [
  { id: '1', deal: 'Acme Corp', owner: 'Alice', discount: 15, status: 'Active' },
  { id: '2', deal: 'TechStart', owner: 'Bob', discount: 10, status: 'Pending' },
  { id: '3', deal: 'Global Systems', owner: 'Carol', discount: 20, status: 'Active' },
];

const accountsData: AccountData[] = [
  { id: '1', account: 'DataFlow Ltd', industry: 'Tech', churnRisk: 35, arr: 120000 },
  { id: '2', account: 'CloudNet', industry: 'SaaS', churnRisk: 15, arr: 250000 },
  { id: '3', account: 'QuickShip', industry: 'Logistics', churnRisk: 45, arr: 80000 },
];

type SortDirection = 'asc' | 'desc' | null;

interface ThProps {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: boolean;
  reversed?: boolean;
  onSort?: () => void;
}

function Th({ children, sortable, sorted, reversed, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  
  if (!sortable) {
    return <Table.Th style={{ fontSize: 12 }}>{children}</Table.Th>;
  }

  return (
    <Table.Th style={{ fontSize: 12 }}>
      <UnstyledButton onClick={onSort} style={{ width: '100%' }}>
        <Group justify="space-between" wrap="nowrap" gap={4}>
          <Text fw={500} size="xs">{children}</Text>
          <Center>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [pipelinesSortBy, setPipelinesSortBy] = useState<string | null>(null);
  const [pipelinesSortDirection, setPipelinesSortDirection] = useState<SortDirection>(null);
  const [dealsSortBy, setDealsSortBy] = useState<string | null>(null);
  const [dealsSortDirection, setDealsSortDirection] = useState<SortDirection>(null);
  const [accountsSortBy, setAccountsSortBy] = useState<string | null>(null);
  const [accountsSortDirection, setAccountsSortDirection] = useState<SortDirection>(null);

  const handlePipelinesSort = (column: string) => {
    if (pipelinesSortBy === column) {
      if (pipelinesSortDirection === 'asc') setPipelinesSortDirection('desc');
      else if (pipelinesSortDirection === 'desc') { setPipelinesSortDirection(null); setPipelinesSortBy(null); }
      else setPipelinesSortDirection('asc');
    } else {
      setPipelinesSortBy(column);
      setPipelinesSortDirection('asc');
    }
  };

  const handleDealsSort = (column: string) => {
    if (dealsSortBy === column) {
      if (dealsSortDirection === 'asc') setDealsSortDirection('desc');
      else if (dealsSortDirection === 'desc') { setDealsSortDirection(null); setDealsSortBy(null); }
      else setDealsSortDirection('asc');
    } else {
      setDealsSortBy(column);
      setDealsSortDirection('asc');
    }
  };

  const handleAccountsSort = (column: string) => {
    if (accountsSortBy === column) {
      if (accountsSortDirection === 'asc') setAccountsSortDirection('desc');
      else if (accountsSortDirection === 'desc') { setAccountsSortDirection(null); setAccountsSortBy(null); }
      else setAccountsSortDirection('asc');
    } else {
      setAccountsSortBy(column);
      setAccountsSortDirection('asc');
    }
  };

  const sortedPipelines = React.useMemo(() => {
    if (!pipelinesSortBy || !pipelinesSortDirection) return pipelinesData;
    return [...pipelinesData].sort((a, b) => {
      if (pipelinesSortBy === 'winProbability') {
        return pipelinesSortDirection === 'asc' ? a.winProbability - b.winProbability : b.winProbability - a.winProbability;
      }
      return 0;
    });
  }, [pipelinesSortBy, pipelinesSortDirection]);

  // Check success condition
  useEffect(() => {
    const pipelinesCorrect = pipelinesSortBy === 'winProbability' && pipelinesSortDirection === 'desc';
    const dealsUntouched = !dealsSortBy || !dealsSortDirection;
    const accountsUntouched = !accountsSortBy || !accountsSortDirection;
    if (pipelinesCorrect && dealsUntouched && accountsUntouched) {
      onSuccess();
    }
  }, [pipelinesSortBy, pipelinesSortDirection, dealsSortBy, dealsSortDirection, accountsSortBy, accountsSortDirection, onSuccess]);

  const pipelinesSortModel: SortModel = pipelinesSortBy && pipelinesSortDirection
    ? [{ column_key: pipelinesSortBy === 'winProbability' ? 'win_probability' : pipelinesSortBy, direction: pipelinesSortDirection, priority: 1 }]
    : [];

  const dealsSortModel: SortModel = dealsSortBy && dealsSortDirection
    ? [{ column_key: dealsSortBy, direction: dealsSortDirection, priority: 1 }]
    : [];

  const accountsSortModel: SortModel = accountsSortBy && accountsSortDirection
    ? [{ column_key: accountsSortBy === 'churnRisk' ? 'churn_risk' : accountsSortBy, direction: accountsSortDirection, priority: 1 }]
    : [];

  return (
    <Group align="flex-start" gap="md" style={{ width: 950 }}>
      {/* Navigation */}
      <Box style={{ width: 180 }}>
        <NavLink label="Dashboard" leftSection={<IconHome size={16} />} active />
        <NavLink label="Analytics" leftSection={<IconChartBar size={16} />} />
        <NavLink label="Team" leftSection={<IconUsers size={16} />} />
      </Box>

      {/* Main content */}
      <Stack style={{ flex: 1 }} gap="md">
        {/* KPI Badges */}
        <Group>
          <Badge size="lg" variant="light">Pipeline: $1.02M</Badge>
          <Badge size="lg" variant="light" color="green">Won: $450K</Badge>
          <Badge size="lg" variant="light" color="orange">At Risk: 3</Badge>
        </Group>

        {/* Pipelines */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} size="sm" mb="sm">Pipelines</Text>
          <Table highlightOnHover data-testid="table-pipelines" data-sort-model={JSON.stringify(pipelinesSortModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Pipeline</Th>
                <Th>Stage</Th>
                <Th sortable sorted={pipelinesSortBy === 'winProbability'} reversed={pipelinesSortDirection === 'desc'} onSort={() => handlePipelinesSort('winProbability')}>Win probability</Th>
                <Th>Value</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedPipelines.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td style={{ fontSize: 12 }}>{row.pipeline}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.stage}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.winProbability}%</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>${row.value.toLocaleString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Deals */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} size="sm" mb="sm">Deals</Text>
          <Table highlightOnHover data-testid="table-deals" data-sort-model={JSON.stringify(dealsSortModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Deal</Th>
                <Th>Owner</Th>
                <Th sortable sorted={dealsSortBy === 'discount'} reversed={dealsSortDirection === 'desc'} onSort={() => handleDealsSort('discount')}>Discount %</Th>
                <Th>Status</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {dealsData.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td style={{ fontSize: 12 }}>{row.deal}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.owner}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.discount}%</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Accounts */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} size="sm" mb="sm">Accounts</Text>
          <Table highlightOnHover data-testid="table-accounts" data-sort-model={JSON.stringify(accountsSortModel)}>
            <Table.Thead>
              <Table.Tr>
                <Th>Account</Th>
                <Th>Industry</Th>
                <Th sortable sorted={accountsSortBy === 'churnRisk'} reversed={accountsSortDirection === 'desc'} onSort={() => handleAccountsSort('churnRisk')}>Churn risk</Th>
                <Th>ARR</Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {accountsData.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td style={{ fontSize: 12 }}>{row.account}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.industry}</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>{row.churnRisk}%</Table.Td>
                  <Table.Td style={{ fontSize: 12 }}>${row.arr.toLocaleString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>
    </Group>
  );
}
