'use client';

/**
 * file_dropzone-mantine-T05: Clear all attached files in Mantine Dropzone
 *
 * setup_description: A centered isolated card (light theme, comfortable spacing) contains one Mantine Dropzone labeled "Attachments".
 * The Dropzone is configured for multiple files (maxFiles=5).
 * Initial state: two uploaded files are already attached and listed below the dropzone:
 * - project-brief.txt (uploaded)
 * - data_export.csv (uploaded)
 * Above the list, there is a small inline action button "Clear all".
 * Clicking "Clear all" removes the entire list and returns the Dropzone to its empty state (no confirmation dialog in this task).
 * No other interactive UI is present.
 *
 * Success: The "Attachments" dropzone has an empty file list (no attached files).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, ActionIcon, Button, Modal, UnstyledButton } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFile, IconX } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'project-brief.txt', type: 'text/plain' },
  { name: 'data_export.csv', type: 'text/csv' },
  { name: 'notes.txt', type: 'text/plain' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([
    { uid: 'initial-1', name: 'project-brief.txt', status: 'uploaded' },
    { uid: 'initial-2', name: 'data_export.csv', status: 'uploaded' },
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (files.length === 0) {
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
    };
    
    setFiles(prev => [...prev, newFile]);
    
    await simulateUpload(500);
    setFiles(prev => prev.map(f => f.uid === newFile.uid ? { ...f, status: 'uploaded' as const } : f));
  };

  const handleRemove = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  const handleClearAll = () => {
    setFiles([]);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Attachments</Text>
      
      <div data-testid="dropzone-attachments">
        <Dropzone
          onDrop={() => {}}
          onClick={() => setPickerOpen(true)}
          maxFiles={5}
          style={{ cursor: 'pointer' }}
        >
          <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: 'none' }}>
            <Dropzone.Idle>
              <IconUpload size={40} stroke={1.5} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>

            <div>
              <Text size="md" inline>
                Drag files here or click to select
              </Text>
            </div>
          </Group>
        </Dropzone>
      </div>

      {files.length > 0 && (
        <>
          <Button 
            variant="subtle" 
            color="red" 
            size="xs" 
            mt="sm"
            onClick={handleClearAll}
          >
            Clear all
          </Button>
          
          <Stack gap="xs" mt="xs">
            {files.map(file => (
              <Group key={file.uid} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 4 }}>
                <Group gap="xs">
                  <IconFile size={18} />
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
        </>
      )}

      <Modal opened={pickerOpen} onClose={() => setPickerOpen(false)} title="Sample files" size="sm">
        <Stack gap="xs">
          {SAMPLE_FILES.map(file => (
            <UnstyledButton
              key={file.name}
              onClick={() => handleSelectFile(file)}
              p="sm"
              style={{ 
                borderRadius: 4, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
              }}
            >
              <IconFile size={20} />
              <Text size="sm">{file.name}</Text>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </Card>
  );
}
