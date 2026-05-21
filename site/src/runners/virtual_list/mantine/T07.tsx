'use client';

/**
 * virtual_list-mantine-T07: Open a modal list, choose a dataset, and confirm
 *
 * Layout: modal_flow. Main page: "Create Report" card with "Choose dataset" button.
 * Clicking opens a Mantine Modal titled "Select dataset" with a scrollable list of 200 datasets.
 * Modal footer: "Cancel" and "Use dataset" buttons.
 *
 * Success: Select 'ds-0091' (Sales 2024) and click "Use dataset"
 */

import React, { useState, useEffect } from 'react';
import { Paper, Text, Box, Button, Modal, Group, Switch, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

interface DatasetItem {
  key: string;
  id: string;
  name: string;
  owner: string;
}

const NAMES = ['Revenue Q1', 'Customer Data', 'Product Inventory', 'Marketing Leads',
  'Support Tickets', 'User Analytics', 'Financial Reports', 'Sales Pipeline',
  'HR Records', 'Compliance Log'];
const OWNERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

const datasets: DatasetItem[] = Array.from({ length: 200 }, (_, i) => {
  const num = i + 1;
  return {
    key: `ds-${String(num).padStart(4, '0')}`,
    id: `DS-${String(num).padStart(4, '0')}`,
    name: num === 91 ? 'Sales 2024' : NAMES[i % NAMES.length],
    owner: OWNERS[i % OWNERS.length],
  };
});

const TARGET_KEY = 'ds-0091';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempSelectedKey, setTempSelectedKey] = useState<string | null>(null);
  const [confirmedDataset, setConfirmedDataset] = useState<DatasetItem | null>(null);

  const handleUseDataset = () => {
    if (tempSelectedKey) {
      const dataset = datasets.find(d => d.key === tempSelectedKey);
      if (dataset) {
        setConfirmedDataset(dataset);
        setModalOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setTempSelectedKey(confirmedDataset?.key || null);
    setModalOpen(false);
  };

  useEffect(() => {
    if (confirmedDataset?.key === TARGET_KEY) {
      onSuccess();
    }
  }, [confirmedDataset, onSuccess]);

  return (
    <>
      <Paper
        shadow="sm"
        p="lg"
        withBorder
        style={{ width: 350 }}
        data-confirmed-dataset={confirmedDataset?.key || 'none'}
      >
        <Text fw={600} size="lg" mb="md">Create Report</Text>
        <Text size="sm" c="dimmed" mb="md">
          Dataset: {confirmedDataset ? `${confirmedDataset.id} — ${confirmedDataset.name}` : 'none'}
        </Text>
        <Button onClick={() => setModalOpen(true)}>Choose dataset</Button>
      </Paper>

      <Modal opened={modalOpen} onClose={handleCancel} title="Select dataset" size="md">
        <Switch label="Recently used" disabled mb="md" />

        <ScrollArea h={320} mb="md" style={{ border: '1px solid #e9ecef', borderRadius: 4 }}>
          {datasets.map(item => (
            <Box
              key={item.key}
              data-item-key={item.key}
              aria-selected={tempSelectedKey === item.key}
              onClick={() => setTempSelectedKey(item.key)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: tempSelectedKey === item.key ? '#e7f5ff' : 'transparent',
              }}
            >
              <Text size="sm" fw={500}>{item.id} — {item.name}</Text>
              <Text size="xs" c="dimmed">Owner: {item.owner}</Text>
            </Box>
          ))}
        </ScrollArea>

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleUseDataset} disabled={!tempSelectedKey}>Use dataset</Button>
        </Group>
      </Modal>
    </>
  );
}
