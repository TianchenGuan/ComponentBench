'use client';

/**
 * file_list_manager-mantine-T04: Search and select a specific invoice
 *
 * setup_description: The Attachments manager is placed near the bottom-right of the viewport (bottom_right
 * placement) within an isolated card. A search TextInput labeled "Search files" filters the table rows by
 * filename. The table contains 18 files including similarly named items like "invoice_2024.pdf",
 * "invoice_2025.pdf", and "invoice_2025_draft.pdf". Row selection is via a checkbox column; initially
 * no rows are selected and the search field is empty.
 *
 * Success: Exactly one file is selected: "invoice_2025.pdf".
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, TextInput, Checkbox, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps, FileItem } from '../types';

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'contract.pdf', type: 'PDF', size: 245000 },
  { id: 'f2', name: 'invoice_2023.pdf', type: 'PDF', size: 145000 },
  { id: 'f3', name: 'invoice_2024.pdf', type: 'PDF', size: 156000 },
  { id: 'f4', name: 'invoice_2025.pdf', type: 'PDF', size: 167000 },
  { id: 'f5', name: 'invoice_2025_draft.pdf', type: 'PDF', size: 178000 },
  { id: 'f6', name: 'receipt_001.pdf', type: 'PDF', size: 45000 },
  { id: 'f7', name: 'receipt_002.pdf', type: 'PDF', size: 52000 },
  { id: 'f8', name: 'report_q1.pdf', type: 'PDF', size: 234000 },
  { id: 'f9', name: 'report_q2.pdf', type: 'PDF', size: 256000 },
  { id: 'f10', name: 'summary.pdf', type: 'PDF', size: 198000 },
  { id: 'f11', name: 'notes.txt', type: 'TXT', size: 4500 },
  { id: 'f12', name: 'draft.docx', type: 'DOCX', size: 128000 },
  { id: 'f13', name: 'budget.xlsx', type: 'XLSX', size: 312000 },
  { id: 'f14', name: 'schedule.xlsx', type: 'XLSX', size: 89000 },
  { id: 'f15', name: 'logo.png', type: 'PNG', size: 67000 },
  { id: 'f16', name: 'banner.jpg', type: 'JPG', size: 234000 },
  { id: 'f17', name: 'presentation.pptx', type: 'PPTX', size: 456000 },
  { id: 'f18', name: 'backup.zip', type: 'ZIP', size: 789000 },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [searchValue, setSearchValue] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    if (selected.length === 1 && selected[0] === 'f4') {
      setCompleted(true);
      onSuccess();
    }
  }, [selected, completed, onSuccess]);

  const filteredFiles = useMemo(() => {
    if (!searchValue.trim()) return initialFiles;
    return initialFiles.filter((f) =>
      f.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  const handleSelect = (fileId: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, fileId] : prev.filter((id) => id !== fileId)
    );
  };

  const rows = filteredFiles.map((file) => (
    <Table.Tr key={file.id} data-testid={`flm-row-${file.id}`}>
      <Table.Td>
        <Checkbox
          checked={selected.includes(file.id)}
          onChange={(e) => handleSelect(file.id, e.currentTarget.checked)}
          data-testid={`flm-select-${file.id}`}
        />
      </Table.Td>
      <Table.Td>{file.name}</Table.Td>
      <Table.Td>{file.type}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={500} data-testid="flm-root">
      <Text fw={500} size="lg" mb="md">Attachments</Text>
      <div data-testid="flm-Attachments">
        <TextInput
          placeholder="Search files"
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          mb="sm"
          data-testid="flm-search"
        />
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }} />
                <Table.Th>File name</Table.Th>
                <Table.Th>Type</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
