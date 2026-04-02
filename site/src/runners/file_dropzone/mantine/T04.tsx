'use client';

/**
 * file_dropzone-mantine-T04: Drag a specific PDF receipt into Mantine Dropzone (top-right form section)
 *
 * setup_description: The UI is a light-theme form_section anchored toward the top-right of the viewport (placement=top_right), with comfortable spacing and default scale.
 * The form shows several non-target fields (merchant selector, amount input, category dropdown) as realistic clutter, but they are not required.
 * The target component is a Mantine Dropzone labeled "Receipts" (accept=.pdf, maxFiles=3).
 * A compact "File tray" below the form provides draggable tiles for testing drag/drop:
 * - invoice-1042.pdf   ← TARGET
 * - invoice-1043.pdf
 * - receipt-sample.pdf
 * Dragging over the Dropzone triggers the Mantine Accept/Reject visual state.
 * On successful drop, the file appears in a list under the Dropzone with filename and "uploaded" status.
 * Initial state: empty (no receipts attached).
 *
 * Success: The "Receipts" dropzone contains exactly one file: invoice-1042.pdf with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, ActionIcon, TextInput, Select, Box } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFile, IconX } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const FILE_TILES: SampleFile[] = [
  { name: 'invoice-1042.pdf', type: 'application/pdf' },
  { name: 'invoice-1043.pdf', type: 'application/pdf' },
  { name: 'receipt-sample.pdf', type: 'application/pdf' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'invoice-1042.pdf' &&
      files[0].status === 'uploaded'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleDragStart = (e: React.DragEvent, file: SampleFile) => {
    e.dataTransfer.setData('application/json', JSON.stringify(file));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      const file: SampleFile = JSON.parse(data);
      
      const newFile: DropzoneFile = {
        uid: generateUid(),
        name: file.name,
        status: 'uploading',
      };
      
      setFiles([newFile]);
      
      await simulateUpload(500);
      setFiles([{ ...newFile, status: 'uploaded' }]);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleRemove = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={500} size="lg" mb="md">Expense Entry</Text>
      
      {/* Distractor fields */}
      <Stack gap="sm" mb="md">
        <TextInput label="Merchant" placeholder="Enter merchant name" />
        <TextInput label="Amount" placeholder="0.00" />
        <Select 
          label="Category" 
          placeholder="Select category"
          data={['Office Supplies', 'Travel', 'Equipment', 'Software']}
        />
      </Stack>

      {/* Target dropzone */}
      <Text fw={500} size="sm" mb="xs">Receipts</Text>
      <div 
        data-testid="dropzone-receipts"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <Dropzone
          onDrop={() => {}}
          accept={['application/pdf']}
          maxFiles={3}
          style={{ 
            cursor: 'pointer',
            borderColor: isDragOver ? 'var(--mantine-color-blue-6)' : undefined,
            backgroundColor: isDragOver ? 'var(--mantine-color-blue-0)' : undefined,
          }}
        >
          <Group justify="center" gap="xl" mih={80} style={{ pointerEvents: 'none' }}>
            <Dropzone.Idle>
              <IconUpload size={32} stroke={1.5} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>
            <Dropzone.Accept>
              <IconUpload size={32} stroke={1.5} color="var(--mantine-color-blue-6)" />
            </Dropzone.Accept>

            <div>
              <Text size="sm" inline>Drag PDF here</Text>
            </div>
          </Group>
        </Dropzone>
      </div>

      {files.length > 0 && (
        <Stack gap="xs" mt="sm">
          {files.map(file => (
            <Group key={file.uid} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 4 }}>
              <Group gap="xs">
                <IconFile size={18} color="red" />
                <div>
                  <Text size="sm">{file.name}</Text>
                  <Text size="xs" c={file.status === 'uploaded' ? 'green' : 'dimmed'}>
                    {file.status === 'uploaded' ? 'Uploaded' : 'Uploading...'}
                  </Text>
                </div>
              </Group>
              <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleRemove(file.uid)}>
                <IconX size={14} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}

      {/* File tray */}
      <Box mt="md" p="sm" bg="gray.1" style={{ borderRadius: 4 }}>
        <Text size="xs" c="dimmed" mb="xs">File tray</Text>
        <Group gap="xs">
          {FILE_TILES.map(file => (
            <Box
              key={file.name}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              p="xs"
              bg="white"
              style={{ 
                borderRadius: 4, 
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                border: '1px solid var(--mantine-color-gray-3)',
              }}
            >
              <IconFile size={14} color="red" />
              {file.name}
            </Box>
          ))}
        </Group>
      </Box>
    </Card>
  );
}
