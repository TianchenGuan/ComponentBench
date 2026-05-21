'use client';

/**
 * file_upload_button-mantine-T25: Match a reference file using Mantine FileButton (top-right)
 *
 * setup_description: The upload UI is placed near the top-right corner of the viewport. An 
 * isolated card titled "Attach file" contains a Mantine FileButton wrapping a Button labeled 
 * "Upload". Next to it, a Reference card displays the target filename and a small file icon; 
 * the reference card is not interactive. After a selection, the page shows a text line under 
 * the button: "Picked file: <name>". The prompt uses the reference card for visual guidance 
 * rather than directly specifying the filename.
 *
 * Success: Exactly one file is selected via the FileButton whose name matches the filename 
 *          shown in the Reference card ("meeting_notes.pdf").
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Text, Group, Paper, Stack, Modal, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const REFERENCE_FILE = 'meeting_notes.pdf';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'meeting_notes.pdf', type: 'application/pdf' },
  { name: 'agenda.pdf', type: 'application/pdf' },
  { name: 'minutes.pdf', type: 'application/pdf' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [pickerOpened, { open: openPicker, close: closePicker }] = useDisclosure(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === REFERENCE_FILE) {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    closePicker();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Attach file</Text>
      
      <Group align="flex-start" gap="lg">
        {/* Uploader */}
        <Stack gap="xs" data-testid="uploader-upload">
          <Button leftSection={<IconUpload size={16} />} onClick={openPicker}>
            Upload
          </Button>
          
          {selectedFile && (
            <Text size="sm" c="dimmed">
              Picked file: {selectedFile}
            </Text>
          )}
        </Stack>
        
        {/* Reference card */}
        <Paper p="md" bg="gray.1" radius="md" style={{ minWidth: 160 }}>
          <Text size="sm" fw={500} mb="sm">Reference</Text>
          <Group gap="xs">
            <IconFile size={20} color="var(--mantine-color-blue-6)" />
            <Text size="sm" data-testid="reference-file-name">{REFERENCE_FILE}</Text>
          </Group>
        </Paper>
      </Group>

      {/* Virtual file picker modal */}
      <Modal opened={pickerOpened} onClose={closePicker} title="Sample files" centered>
        <Stack gap="xs">
          {SAMPLE_FILES.map((file) => (
            <UnstyledButton
              key={file.name}
              onClick={() => handleSelectFile(file)}
              style={{
                padding: '12px',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Group gap="sm">
                <IconFile size={20} />
                <Text size="sm">{file.name}</Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </Card>
  );
}
