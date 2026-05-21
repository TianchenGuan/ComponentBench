'use client';

/**
 * file_upload_button-mantine-T23: Clear a selected file with FileInput clear button
 *
 * setup_description: A centered isolated card titled "Attachment" contains a Mantine FileInput 
 * with label "Attachment" and the prop clearable enabled. The page loads with a file already 
 * selected: "notes.txt" is displayed as the current value inside the input. Because clearable 
 * is enabled, a small clear (×) button appears in the right section of the input when a file 
 * is selected. Clicking the clear button resets the FileInput back to its placeholder state 
 * with no file selected.
 *
 * Success: The FileInput labeled "Attachment" has no selected file (0 files).
 *          The input displays its empty/placeholder state (notes.txt is not shown).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Modal, Stack, UnstyledButton, Group, TextInput, CloseButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFile } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'notes.txt', type: 'text/plain' },
  { name: 'document.txt', type: 'text/plain' },
  { name: 'readme.txt', type: 'text/plain' },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>('notes.txt');
  const [completed, setCompleted] = useState(false);
  const [pickerOpened, { open: openPicker, close: closePicker }] = useDisclosure(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === null) {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    closePicker();
  };

  const handleClear = () => {
    setSelectedFile(null);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Attachment</Text>
      
      <div data-testid="uploader-attachment">
        <TextInput
          label="Attachment"
          placeholder="Select file"
          value={selectedFile || ''}
          readOnly
          onClick={openPicker}
          leftSection={<IconFile size={16} />}
          rightSection={
            selectedFile && (
              <CloseButton
                size="sm"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
                aria-label="Clear value"
              />
            )
          }
          styles={{ input: { cursor: 'pointer' } }}
        />
      </div>

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
