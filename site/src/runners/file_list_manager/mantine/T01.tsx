'use client';

/**
 * file_list_manager-mantine-T01: Make an image file public
 *
 * setup_description: A single centered card contains a Mantine-styled file list manager displayed as a Table.
 * Columns: File, Size, Public. The Public column uses a checkbox-style toggle per row. The list has 6 files;
 * "team_photo.png" currently has Public unchecked. Toggling Public applies immediately.
 *
 * Success: "team_photo.png" has Public enabled in the Attachments manager. No other Public toggles change.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Checkbox, Text } from '@mantine/core';
import type { TaskComponentProps, FileItem } from '../types';
import { formatFileSize } from '../types';

interface FileWithPublic extends FileItem {
  public: boolean;
}

const initialFiles: FileWithPublic[] = [
  { id: 'f1', name: 'contract.pdf', type: 'PDF', size: 245000, public: true },
  { id: 'f2', name: 'team_photo.png', type: 'PNG', size: 512000, public: false },
  { id: 'f3', name: 'report.docx', type: 'DOCX', size: 128000, public: false },
  { id: 'f4', name: 'logo.svg', type: 'SVG', size: 34000, public: true },
  { id: 'f5', name: 'notes.txt', type: 'TXT', size: 4500, public: false },
  { id: 'f6', name: 'summary.pdf', type: 'PDF', size: 198000, public: true },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileWithPublic[]>(initialFiles);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const teamPhoto = files.find((f) => f.id === 'f2');
    if (teamPhoto && teamPhoto.public === true) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleTogglePublic = (fileId: string, checked: boolean) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, public: checked } : f))
    );
  };

  const rows = files.map((file) => (
    <Table.Tr key={file.id} data-testid={`flm-row-${file.id}`}>
      <Table.Td>{file.name}</Table.Td>
      <Table.Td>{formatFileSize(file.size)}</Table.Td>
      <Table.Td>
        <Checkbox
          checked={file.public}
          onChange={(e) => handleTogglePublic(file.id, e.currentTarget.checked)}
          aria-checked={file.public}
          data-testid={`flm-public-${file.id}`}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={500} data-testid="flm-root">
      <Text fw={500} size="lg" mb="md">Attachments</Text>
      <div data-testid="flm-Attachments">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>File</Table.Th>
              <Table.Th>Size</Table.Th>
              <Table.Th>Public</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </Card>
  );
}
