'use client';

/**
 * data_grid_row_selection-mantine-T05: Select approvers in a modal and save
 *
 * The base page shows a single button labeled "Choose approvers" (modal_flow).
 * Clicking it opens a Mantine Modal titled "Choose approvers". Inside the modal is a Mantine Table with a
 * leading Checkbox column (composed row selection).
 * Spacing is comfortable and scale is default. The modal table shows 10 approver rows with columns:
 * Approver ID, Name, Department.
 * Initial state: no approvers selected. The modal footer has "Cancel" and a primary "Save" button.
 * Feedback: checking a row updates the checkbox and highlights the row; clicking Save closes the modal and
 * commits the selected approver IDs.
 *
 * Success: selected_row_ids equals ['appr_A02', 'appr_A05', 'appr_A09'] AND require_confirm (Save clicked)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Text, Checkbox, Button, Modal, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface ApproverData {
  key: string;
  approverId: string;
  name: string;
  department: string;
}

const approversData: ApproverData[] = [
  { key: 'appr_A01', approverId: 'A-01', name: 'Alice Chen', department: 'Engineering' },
  { key: 'appr_A02', approverId: 'A-02', name: 'Bob Martinez', department: 'Finance' },
  { key: 'appr_A03', approverId: 'A-03', name: 'Carol Williams', department: 'Legal' },
  { key: 'appr_A04', approverId: 'A-04', name: 'David Kim', department: 'HR' },
  { key: 'appr_A05', approverId: 'A-05', name: 'Eva Schmidt', department: 'Operations' },
  { key: 'appr_A06', approverId: 'A-06', name: 'Frank Jones', department: 'Engineering' },
  { key: 'appr_A07', approverId: 'A-07', name: 'Grace Liu', department: 'Finance' },
  { key: 'appr_A08', approverId: 'A-08', name: 'Henry Wilson', department: 'Legal' },
  { key: 'appr_A09', approverId: 'A-09', name: 'Iris Chang', department: 'HR' },
  { key: 'appr_A10', approverId: 'A-10', name: 'Jack Brown', department: 'Operations' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedKeys, setModalSelectedKeys] = useState<Set<string>>(new Set());
  const [committedSelection, setCommittedSelection] = useState<string[]>([]);
  const hasSucceeded = useRef(false);

  const toggleRow = (key: string) => {
    setModalSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setModalSelectedKeys(new Set());
  };

  const handleSave = () => {
    setCommittedSelection(Array.from(modalSelectedKeys));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalSelectedKeys(new Set());
  };

  // Check success condition
  useEffect(() => {
    if (!hasSucceeded.current && selectionEquals(committedSelection, ['appr_A02', 'appr_A05', 'appr_A09'])) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedSelection, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
      <Button onClick={handleOpenModal} data-testid="choose-approvers-btn">
        Choose approvers
      </Button>

      <Modal
        opened={isModalOpen}
        onClose={handleCancel}
        title="Choose approvers"
        size="lg"
      >
        <Table
          highlightOnHover
          data-testid="approvers-table"
          data-modal-selected={JSON.stringify(Array.from(modalSelectedKeys))}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }} />
              <Table.Th>Approver ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Department</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {approversData.map((row) => (
              <Table.Tr
                key={row.key}
                bg={modalSelectedKeys.has(row.key) ? 'var(--mantine-color-blue-light)' : undefined}
                data-row-id={row.key}
                data-selected={modalSelectedKeys.has(row.key)}
              >
                <Table.Td>
                  <Checkbox
                    checked={modalSelectedKeys.has(row.key)}
                    onChange={() => toggleRow(row.key)}
                    aria-label={`Select ${row.name}`}
                  />
                </Table.Td>
                <Table.Td>{row.approverId}</Table.Td>
                <Table.Td>{row.name}</Table.Td>
                <Table.Td>{row.department}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} data-testid="save-btn">Save</Button>
        </Group>
      </Modal>

      <div
        style={{ display: 'none' }}
        data-testid="committed-selection"
        data-selected-row-ids={JSON.stringify(committedSelection)}
      />
    </Card>
  );
}
