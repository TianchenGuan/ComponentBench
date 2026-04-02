'use client';

/**
 * file_upload_button-mantine-T26: Confirm file removal in a Mantine Modal
 *
 * setup_description: A centered isolated card titled "Attachment" contains a Mantine FileInput 
 * labeled "Attachment" that is pre-filled with the file "budget.xlsx". To the right of the 
 * FileInput is a small outlined button labeled "Remove". Clicking the Remove button opens a 
 * Mantine Modal titled "Remove file?" with two actions: "Cancel" and "Remove". The file is 
 * only cleared from the FileInput after confirming with the modal's "Remove" button.
 *
 * Success: The FileInput labeled "Attachment" has no selected file (0 files).
 *          The confirmation modal was accepted by clicking "Remove".
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Text, Group, Modal, Stack, TextInput, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFile, IconTrash } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'budget.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { name: 'report.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { name: 'data.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>('budget.xlsx');
  const [removeOpened, { open: openRemove, close: closeRemove }] = useDisclosure(false);
  const [pickerOpened, { open: openPicker, close: closePicker }] = useDisclosure(false);
  const [completed, setCompleted] = useState(false);
  const [confirmAccepted, setConfirmAccepted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === null && confirmAccepted) {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, confirmAccepted, completed, onSuccess]);

  const handleConfirmRemove = () => {
    setConfirmAccepted(true);
    setSelectedFile(null);
    closeRemove();
  };

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    closePicker();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Attachment</Text>
      
      <Group align="flex-end" gap="sm" data-testid="uploader-attachment">
        <TextInput
          label="Attachment"
          placeholder="Select file"
          value={selectedFile || ''}
          readOnly
          onClick={openPicker}
          leftSection={<IconFile size={16} />}
          style={{ flex: 1 }}
          styles={{ input: { cursor: 'pointer' } }}
        />
        
        {selectedFile && (
          <Button 
            variant="outline" 
            color="red" 
            leftSection={<IconTrash size={16} />}
            onClick={openRemove}
          >
            Remove
          </Button>
        )}
      </Group>

      {/* Confirmation Modal */}
      <Modal 
        opened={removeOpened} 
        onClose={closeRemove} 
        title="Remove file?"
        data-testid="remove-modal"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to remove this file?
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={closeRemove}>
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </Group>
        </Stack>
      </Modal>

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
