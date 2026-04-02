'use client';

/**
 * table_static-mantine-T06: Open a modal picker and select a template row
 *
 * The page uses a modal_flow: a button labeled "Choose report template" opens a Mantine Modal. Inside
 * the modal is a read-only Templates table (Mantine Table) with columns: Template, Description. Rows are single-select;
 * clicking a row highlights it immediately (no Apply/OK required for success). Initial state: modal closed; when opened,
 * no row is selected. The rest of the page background has a few non-interactive form labels, but the modal captures attention.
 */

import React, { useState } from 'react';
import { Table, Card, Text, Button, Modal } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface TemplateData {
  key: string;
  template: string;
  description: string;
}

const templatesData: TemplateData[] = [
  { key: 'Weekly Summary', template: 'Weekly Summary', description: 'Overview of weekly metrics and KPIs' },
  { key: 'Monthly Summary', template: 'Monthly Summary', description: 'Comprehensive monthly performance report' },
  { key: 'Quarterly Review', template: 'Quarterly Review', description: 'Detailed quarterly business analysis' },
  { key: 'Annual Report', template: 'Annual Report', description: 'Full year performance and projections' },
  { key: 'Custom Report', template: 'Custom Report', description: 'Build your own report from scratch' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedRowKey(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRowClick = (record: TemplateData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'Monthly Summary') {
      onSuccess();
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={500} size="md" mb="md">Report Generator</Text>
        
        {/* Non-interactive form labels for light clutter */}
        <Text size="sm" c="dimmed" mb="xs">Report Settings</Text>
        <Text size="sm" mb="md">Configure your report options below.</Text>
        
        <Button onClick={handleOpenModal}>
          Choose report template
        </Button>
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title="Select Template"
        size="md"
      >
        <Text size="sm" mb="md">Templates</Text>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Template</Table.Th>
              <Table.Th>Description</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {templatesData.map((row) => (
              <Table.Tr
                key={row.key}
                onClick={() => handleRowClick(row)}
                aria-selected={selectedRowKey === row.key}
                data-row-key={row.key}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedRowKey === row.key ? 'var(--mantine-color-blue-light)' : undefined,
                }}
              >
                <Table.Td>{row.template}</Table.Td>
                <Table.Td>{row.description}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Modal>
    </>
  );
}
