'use client';

/**
 * file_dropzone-mantine-T09: Cancel a Mantine confirmation modal to keep the file
 *
 * setup_description: The UI is rendered in dark theme and uses a modal_flow interaction.
 * A centered card contains one Mantine Dropzone labeled "Documents" (accept=.pdf, maxFiles=1).
 * Initial state: the file list under the Dropzone already contains:
 * - passport.pdf (status: uploaded)
 * The file row has a remove action icon. Clicking remove opens a Mantine Modal confirmation dialog with:
 * - Title: "Remove file?"
 * - Two buttons: "Remove" (destructive) and "Cancel"
 * The task requires choosing "Cancel" so that the modal closes and the file remains attached.
 * No other UI actions (save/close) are needed.
 *
 * Success: A remove confirmation for passport.pdf was opened and cancelled (Cancel clicked at least once).
 *          The Documents dropzone still contains passport.pdf with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, ActionIcon, Modal, Button, MantineProvider, createTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFile, IconX } from '@tabler/icons-react';
import type { TaskComponentProps, DropzoneFile } from '../types';

const darkTheme = createTheme({
  primaryColor: 'blue',
});

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([
    { uid: 'initial-1', name: 'passport.pdf', status: 'uploaded' },
  ]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cancelClicked, setCancelClicked] = useState(false);

  // Initialize event counter on window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as typeof window & { __cb_events?: Record<string, number> }).__cb_events = 
        (window as typeof window & { __cb_events?: Record<string, number> }).__cb_events || {};
      (window as typeof window & { __cb_events: Record<string, number> }).__cb_events.remove_confirmation_cancelled = 0;
    }
  }, []);

  useEffect(() => {
    if (completed) return;
    
    if (
      cancelClicked &&
      files.length === 1 &&
      files[0].name === 'passport.pdf' &&
      files[0].status === 'uploaded'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, cancelClicked, completed, onSuccess]);

  const handleRemoveClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    setFiles([]);
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    setCancelClicked(true);
    setConfirmOpen(false);
    if (typeof window !== 'undefined') {
      (window as typeof window & { __cb_events: Record<string, number> }).__cb_events.remove_confirmation_cancelled++;
    }
  };

  return (
    <MantineProvider defaultColorScheme="dark" theme={darkTheme}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400, background: '#1a1b1e' }}>
        <Text fw={500} size="lg" mb="md" c="white">Documents</Text>
        
        <div data-testid="dropzone-documents">
          <Dropzone
            onDrop={() => {}}
            accept={['application/pdf']}
            maxFiles={1}
            style={{ 
              cursor: 'pointer',
              background: '#25262b',
              borderColor: '#373A40',
            }}
          >
            <Group justify="center" gap="xl" mih={80} style={{ pointerEvents: 'none' }}>
              <Dropzone.Idle>
                <IconUpload size={32} stroke={1.5} color="#5c5f66" />
              </Dropzone.Idle>

              <div>
                <Text size="sm" c="dimmed">
                  Drag PDF here or click to select
                </Text>
              </div>
            </Group>
          </Dropzone>
        </div>

        {files.length > 0 && (
          <Stack gap="xs" mt="md">
            {files.map(file => (
              <Group 
                key={file.uid} 
                justify="space-between" 
                p="xs" 
                style={{ background: '#25262b', borderRadius: 4 }}
              >
                <Group gap="xs">
                  <IconFile size={20} color="#fa5252" />
                  <div>
                    <Text size="sm" c="white">{file.name}</Text>
                    <Text size="xs" c={file.status === 'uploaded' ? 'green' : 'dimmed'}>
                      {file.status === 'uploaded' ? 'Uploaded' : 'Uploading...'}
                    </Text>
                  </div>
                </Group>
                <ActionIcon variant="subtle" color="gray" onClick={handleRemoveClick}>
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        )}

        {/* Confirmation modal */}
        <Modal 
          opened={confirmOpen} 
          onClose={() => setConfirmOpen(false)} 
          title="Remove file?"
          centered
        >
          <Text size="sm" mb="lg">
            Are you sure you want to remove this file? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={handleCancel}>Cancel</Button>
            <Button color="red" onClick={handleConfirmRemove}>Remove</Button>
          </Group>
        </Modal>
      </Card>
    </MantineProvider>
  );
}
