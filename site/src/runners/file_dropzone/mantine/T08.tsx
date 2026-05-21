'use client';

/**
 * file_dropzone-mantine-T08: Upload matching banner from a tiny table-cell dropzone (visual)
 *
 * setup_description: The page is rendered as a table_cell layout: a small two-column table is centered on the page.
 * Theme is light, but spacing is compact and the table uses small scale (small cell padding and small controls).
 * Row label: "Header banner".
 * - The left cell shows a "Reference" thumbnail (target banner preview).
 * - The right cell contains a small Mantine Dropzone (mini variant) used as the upload target.
 * The mini Dropzone supports click-to-open a small in-page picker popover with 4 candidate banner thumbnails:
 * - banner-A.png
 * - banner-B.png   ← (this one matches the reference)
 * - banner-C.png
 * - banner-D.png
 * Candidate filenames are neutral; selection should be made by matching the thumbnail visuals.
 * After selection, the Dropzone cell shows the chosen banner thumbnail and an "uploaded" badge.
 * Initial state: empty (no file attached).
 *
 * Success: The Header banner dropzone contains exactly one file: banner-B.png with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Group, ActionIcon, Modal, Box, Table, Badge } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconX } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const BANNER_FILES: SampleFile[] = [
  { name: 'banner-A.png', type: 'image/png' },
  { name: 'banner-B.png', type: 'image/png' },  // Target - matches reference
  { name: 'banner-C.png', type: 'image/png' },
  { name: 'banner-D.png', type: 'image/png' },
];

// Generate distinct banner colors for visual matching
const getBannerColor = (name: string): string => {
  const colors: Record<string, string> = {
    'banner-A.png': '#e74c3c',  // Red
    'banner-B.png': '#3498db',  // Blue - TARGET
    'banner-C.png': '#2ecc71',  // Green
    'banner-D.png': '#f39c12',  // Orange
  };
  return colors[name] || '#999';
};

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'banner-B.png' &&
      files[0].status === 'uploaded'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleSelectFile = async (sample: SampleFile) => {
    setPickerOpen(false);
    
    const newFile: DropzoneFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
      thumbUrl: getBannerColor(sample.name),
    };
    
    setFiles([newFile]);
    
    await simulateUpload(500);
    setFiles([{ ...newFile, status: 'uploaded' }]);
  };

  const handleRemove = () => {
    setFiles([]);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="md" mb="md">Banner Settings</Text>
      
      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 100, fontSize: 11 }}>Reference</Table.Th>
            <Table.Th style={{ fontSize: 11 }}>Upload</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td style={{ padding: 8 }}>
              <Text size="xs" c="dimmed" mb={4}>Header banner</Text>
              <Box
                style={{
                  width: '100%',
                  height: 30,
                  background: getBannerColor('banner-B.png'),  // Reference color
                  borderRadius: 2,
                }}
              />
            </Table.Td>
            <Table.Td style={{ padding: 8 }}>
              {files.length === 0 ? (
                <div data-testid="dropzone-header-banner">
                  <Dropzone
                    onDrop={() => {}}
                    onClick={() => setPickerOpen(true)}
                    accept={['image/png']}
                    maxFiles={1}
                    style={{ cursor: 'pointer', minHeight: 40 }}
                    p="xs"
                  >
                    <Group justify="center" style={{ pointerEvents: 'none' }}>
                      <IconUpload size={16} color="var(--mantine-color-dimmed)" />
                      <Text size="xs" c="dimmed">Upload</Text>
                    </Group>
                  </Dropzone>
                </div>
              ) : (
                <Group justify="space-between" gap="xs">
                  <Group gap="xs">
                    <Box
                      style={{
                        width: 40,
                        height: 25,
                        background: files[0].thumbUrl,
                        borderRadius: 2,
                      }}
                    />
                    <div>
                      <Text size="xs">{files[0].name}</Text>
                      {files[0].status === 'uploaded' && (
                        <Badge size="xs" color="green">Uploaded</Badge>
                      )}
                    </div>
                  </Group>
                  <ActionIcon variant="subtle" color="gray" size="xs" onClick={handleRemove}>
                    <IconX size={12} />
                  </ActionIcon>
                </Group>
              )}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Modal opened={pickerOpen} onClose={() => setPickerOpen(false)} title="Select banner" size="sm">
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {BANNER_FILES.map(file => (
            <Box
              key={file.name}
              onClick={() => handleSelectFile(file)}
              style={{
                cursor: 'pointer',
                padding: 8,
                border: '1px solid var(--mantine-color-gray-3)',
                borderRadius: 4,
                textAlign: 'center',
              }}
            >
              <Box
                style={{
                  width: '100%',
                  height: 40,
                  background: getBannerColor(file.name),
                  borderRadius: 2,
                  marginBottom: 4,
                }}
              />
              <Text size="xs">{file.name}</Text>
            </Box>
          ))}
        </Box>
      </Modal>
    </Card>
  );
}
