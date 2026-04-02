'use client';

/**
 * file_list_manager-mantine-T06: Move a file to a new folder (choose the correct manager)
 *
 * setup_description: Two file list managers (instances=2) appear in one centered card: "Client files" and
 * "Internal files". Each is a Mantine Table with columns: File name, Folder, Actions. Folder is editable via a
 * Select control in each row (options: Unsorted, Images, Contracts, Receipts). In "Internal files", the row
 * "profile_pic.jpg" currently shows Folder = Unsorted. In "Client files", there is another "profile_pic.jpg"
 * entry as a distractor that should not be changed.
 *
 * Success: In "Internal files", "profile_pic.jpg" has Folder set to "Images".
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Text, Divider } from '@mantine/core';
import type { TaskComponentProps, FileItem } from '../types';

interface FileWithFolder extends FileItem {
  folder: string;
}

const clientFiles: FileWithFolder[] = [
  { id: 'c1', name: 'profile_pic.jpg', type: 'JPG', size: 245000, folder: 'Unsorted' },
  { id: 'c2', name: 'contract.pdf', type: 'PDF', size: 312000, folder: 'Contracts' },
  { id: 'c3', name: 'invoice.pdf', type: 'PDF', size: 156000, folder: 'Receipts' },
];

const internalFiles: FileWithFolder[] = [
  { id: 'i1', name: 'profile_pic.jpg', type: 'JPG', size: 189000, folder: 'Unsorted' },
  { id: 'i2', name: 'notes.txt', type: 'TXT', size: 4500, folder: 'Unsorted' },
  { id: 'i3', name: 'memo.docx', type: 'DOCX', size: 67000, folder: 'Contracts' },
  { id: 'i4', name: 'receipt.pdf', type: 'PDF', size: 89000, folder: 'Receipts' },
];

const folderOptions = ['Unsorted', 'Images', 'Contracts', 'Receipts'];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [clientData, setClientData] = useState<FileWithFolder[]>(clientFiles);
  const [internalData, setInternalData] = useState<FileWithFolder[]>(internalFiles);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const profilePic = internalData.find((f) => f.id === 'i1');
    if (profilePic && profilePic.folder === 'Images') {
      setCompleted(true);
      onSuccess();
    }
  }, [internalData, completed, onSuccess]);

  const handleClientFolderChange = (fileId: string, folder: string | null) => {
    if (!folder) return;
    setClientData((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, folder } : f))
    );
  };

  const handleInternalFolderChange = (fileId: string, folder: string | null) => {
    if (!folder) return;
    setInternalData((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, folder } : f))
    );
  };

  const renderRows = (
    files: FileWithFolder[],
    onFolderChange: (fileId: string, folder: string | null) => void
  ) =>
    files.map((file) => (
      <Table.Tr key={file.id} data-testid={`flm-row-${file.id}`}>
        <Table.Td>{file.name}</Table.Td>
        <Table.Td>
          <Select
            value={file.folder}
            onChange={(v) => onFolderChange(file.id, v)}
            data={folderOptions}
            size="xs"
            w={120}
            data-testid={`flm-folder-${file.id}`}
          />
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={600} data-testid="flm-root">
      {/* Client files manager */}
      <Text fw={500} size="md" mb="sm" data-testid="flm-Client-files-header">Client files</Text>
      <div data-testid="flm-Client files">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>File name</Table.Th>
              <Table.Th>Folder</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRows(clientData, handleClientFolderChange)}</Table.Tbody>
        </Table>
      </div>

      <Divider my="md" />

      {/* Internal files manager */}
      <Text fw={500} size="md" mb="sm" data-testid="flm-Internal-files-header">Internal files</Text>
      <div data-testid="flm-Internal files">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>File name</Table.Th>
              <Table.Th>Folder</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRows(internalData, handleInternalFolderChange)}</Table.Tbody>
        </Table>
      </div>
    </Card>
  );
}
