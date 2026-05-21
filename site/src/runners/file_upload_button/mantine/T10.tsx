'use client';

/**
 * file_upload_button-mantine-T30: Open file details overlay from a small icon button
 *
 * setup_description: A centered isolated card titled "Budget file" uses a small-scale Mantine 
 * FileInput labeled "Budget file". The FileInput is pre-filled with the selected file "budget.xlsx" 
 * and shows the filename in the field. To the right of the input is a small info/action icon button 
 * labeled (via aria-label) "View details". Clicking the icon opens a Mantine Modal overlay titled 
 * "File details" that displays the filename and basic metadata (type/size). The modal includes a 
 * Close button, but the task requires leaving the overlay open.
 *
 * Success: A modal overlay titled "File details" is open.
 *          The overlay shows details for the file named "budget.xlsx".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Group, Modal, Stack, ActionIcon, Badge, TextInput, UnstyledButton, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFile, IconInfoCircle } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'budget.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 15360 },
  { name: 'report.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 20480 },
  { name: 'data.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 10240 },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<SampleFile | null>(SAMPLE_FILES[0]);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [pickerOpened, { open: openPicker, close: closePicker }] = useDisclosure(false);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (detailsOpened) {
      setCompleted(true);
      onSuccess();
    }
  }, [detailsOpened, completed, onSuccess]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample);
    closePicker();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Budget file</Text>
      
      <Group align="flex-end" gap="sm" data-testid="uploader-budget">
        <TextInput
          size="sm"
          label="Budget file"
          placeholder="Select file"
          value={selectedFile?.name || ''}
          readOnly
          onClick={openPicker}
          leftSection={<IconFile size={14} />}
          style={{ flex: 1 }}
          styles={{ input: { cursor: 'pointer' } }}
        />
        
        <ActionIcon
          variant="light"
          aria-label="View details"
          onClick={openDetails}
          size="lg"
        >
          <IconInfoCircle size={18} />
        </ActionIcon>
      </Group>

      {/* File Details Modal */}
      <Modal 
        opened={detailsOpened} 
        onClose={closeDetails} 
        title="File details"
        data-testid="file-details-modal"
        data-file-name={selectedFile?.name}
        centered
      >
        {selectedFile && (
          <Stack gap="md">
            <Group gap="sm">
              <IconFile size={24} color="var(--mantine-color-blue-6)" />
              <Text fw={500}>{selectedFile.name}</Text>
            </Group>
            
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Type</Text>
                <Badge variant="light" size="sm">
                  {selectedFile.type || 'Unknown'}
                </Badge>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Size</Text>
                <Text size="sm">{formatFileSize(selectedFile.size || 0)}</Text>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Last modified</Text>
                <Text size="sm">{new Date().toLocaleDateString()}</Text>
              </Group>
            </Stack>

            <Button variant="default" onClick={closeDetails}>
              Close
            </Button>
          </Stack>
        )}
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
