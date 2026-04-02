'use client';

/**
 * file_dropzone-mantine-T03: Remove the existing file from Mantine Dropzone
 *
 * setup_description: Baseline scene: centered isolated card (light theme, comfortable spacing).
 * A single Mantine Dropzone labeled "Documents" is shown.
 * Initial state: one file is already attached and listed below the Dropzone:
 * - resume-alex-chen.pdf (status: uploaded)
 * The file row includes a small remove action (Mantine ActionIcon) aligned to the right.
 * Clicking remove immediately removes the file row and returns the dropzone to its empty state (no confirmation for this task).
 * The drop area remains available for adding files, but adding is not required.
 *
 * Success: The "Documents" dropzone has no files attached (empty list).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, ActionIcon, Modal, UnstyledButton } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFile, IconX, IconFileText } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'resume-alex-chen.pdf', type: 'application/pdf' },
  { name: 'project-brief.txt', type: 'text/plain' },
  { name: 'notes.txt', type: 'text/plain' },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([
    { uid: 'initial-1', name: 'resume-alex-chen.pdf', status: 'uploaded' },
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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Documents</Text>
      
      <div data-testid="dropzone-documents">
        <Dropzone
          onDrop={() => {}}
          onClick={() => setPickerOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: 'none' }}>
            <Dropzone.Idle>
              <IconUpload size={40} stroke={1.5} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>

            <div>
              <Text size="md" inline>
                Drag file here or click to select
              </Text>
            </div>
          </Group>
        </Dropzone>
      </div>

      {files.length > 0 && (
        <Stack gap="xs" mt="md">
          {files.map(file => (
            <Group key={file.uid} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 4 }}>
              <Group gap="xs">
                <IconFileText size={20} />
                <div>
                  <Text size="sm">{file.name}</Text>
                  <Text size="xs" c={file.status === 'uploaded' ? 'green' : 'dimmed'}>
                    {file.status === 'uploaded' ? 'Uploaded' : 'Uploading...'}
                  </Text>
                </div>
              </Group>
              <ActionIcon variant="subtle" color="gray" onClick={() => handleRemove(file.uid)}>
                <IconX size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
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
