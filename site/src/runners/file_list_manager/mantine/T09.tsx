'use client';

/**
 * file_list_manager-mantine-T09: Scroll to a deep item and change its status in a dashboard
 *
 * setup_description: The page is a small dashboard layout with a left sidebar, a header, and several statistic
 * cards (high clutter). In the main panel is the Attachments file list manager as a scrollable Mantine Table
 * with 40 files; only ~10 rows are visible at once. Rows include a Status column implemented as a Select control
 * (options: Active, Reviewed, Archived). "2019_archive.zip" appears far down the list and is not initially
 * visible without scrolling. Its initial Status is Active.
 *
 * Success: For "2019_archive.zip", the Status field is set to "Archived" in the Attachments manager.
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Text, Box, Grid, Paper } from '@mantine/core';
import type { TaskComponentProps, FileItem } from '../types';

interface FileWithStatus extends FileItem {
  status: string;
}

// Generate 40 files with 2019_archive.zip at position 32
const generateFiles = (): FileWithStatus[] => {
  const files: FileWithStatus[] = [];
  for (let i = 1; i <= 40; i++) {
    const name =
      i === 32
        ? '2019_archive.zip'
        : `file-${String(i).padStart(3, '0')}.${['pdf', 'docx', 'xlsx', 'txt', 'png'][i % 5]}`;
    files.push({
      id: `f${i}`,
      name,
      type: name.split('.').pop()?.toUpperCase() || 'FILE',
      size: Math.floor(10000 + Math.random() * 500000),
      status: 'Active',
    });
  }
  return files;
};

const initialFiles = generateFiles();
const statusOptions = ['Active', 'Reviewed', 'Archived'];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<FileWithStatus[]>(initialFiles);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const targetFile = files.find((f) => f.name === '2019_archive.zip');
    if (targetFile && targetFile.status === 'Archived') {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleStatusChange = (fileId: string, status: string | null) => {
    if (!status) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status } : f))
    );
  };

  const rows = files.map((file) => (
    <Table.Tr key={file.id} data-testid={`flm-row-${file.id}`}>
      <Table.Td>{file.name}</Table.Td>
      <Table.Td>
        <Select
          value={file.status}
          onChange={(v) => handleStatusChange(file.id, v)}
          data={statusOptions}
          size="xs"
          w={100}
          data-testid={`flm-status-${file.id}`}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box data-testid="flm-root">
      {/* Dashboard layout with clutter */}
      <Grid>
        {/* Sidebar */}
        <Grid.Col span={2}>
          <Paper p="sm" withBorder h={400}>
            <Text size="sm" fw={500}>Navigation</Text>
            <Text size="xs" c="dimmed" mt="sm">Dashboard</Text>
            <Text size="xs" c="dimmed">Files</Text>
            <Text size="xs" c="dimmed">Settings</Text>
          </Paper>
        </Grid.Col>

        {/* Main content */}
        <Grid.Col span={10}>
          {/* Stats cards (clutter) */}
          <Grid mb="md">
            <Grid.Col span={3}>
              <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed">Total Files</Text>
                <Text fw={500}>40</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed">Storage Used</Text>
                <Text fw={500}>2.4 GB</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed">Active</Text>
                <Text fw={500}>38</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed">Archived</Text>
                <Text fw={500}>2</Text>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* Attachments table */}
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} mb="sm">Attachments</Text>
            <div
              data-testid="flm-Attachments"
              style={{ maxHeight: 280, overflow: 'auto' }}
            >
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>File name</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
