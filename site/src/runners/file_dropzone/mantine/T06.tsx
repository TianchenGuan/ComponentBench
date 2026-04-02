'use client';

/**
 * file_dropzone-mantine-T06: Upload to the correct Mantine Dropzone instance (ID back)
 *
 * setup_description: A centered isolated card (light theme, comfortable spacing) contains two Mantine Dropzone instances in a two-column grid:
 * - "Front of ID"
 * - "Back of ID"  ← TARGET
 * Both instances accept images only (accept=image/*, maxFiles=1).
 * Clicking either dropzone opens an in-page "Sample files" picker listing:
 * - id-front.jpg
 * - id-back.jpg   ← TARGET
 * - selfie.jpg
 * After selection, each instance shows a small preview and a file row under that particular dropzone.
 * Initial state: both instances are empty.
 *
 * Success: The "Back of ID" dropzone contains exactly one file: id-back.jpg with status "uploaded".
 *          The "Front of ID" dropzone is empty.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, ActionIcon, Modal, UnstyledButton, SimpleGrid } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'id-front.jpg', type: 'image/jpeg' },
  { name: 'id-back.jpg', type: 'image/jpeg' },
  { name: 'selfie.jpg', type: 'image/jpeg' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [frontFiles, setFrontFiles] = useState<DropzoneFile[]>([]);
  const [backFiles, setBackFiles] = useState<DropzoneFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeDropzone, setActiveDropzone] = useState<'front' | 'back' | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      frontFiles.length === 0 &&
      backFiles.length === 1 &&
      backFiles[0].name === 'id-back.jpg' &&
      backFiles[0].status === 'uploaded'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [frontFiles, backFiles, completed, onSuccess]);

  const handleOpenPicker = (dropzone: 'front' | 'back') => {
    setActiveDropzone(dropzone);
    setPickerOpen(true);
  };

  const handleSelectFile = async (sample: SampleFile) => {
    setPickerOpen(false);
    
    const newFile: DropzoneFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    const setFiles = activeDropzone === 'front' ? setFrontFiles : setBackFiles;
    setFiles([newFile]);
    
    await simulateUpload(500);
    setFiles([{ ...newFile, status: 'uploaded' }]);
    
    setActiveDropzone(null);
  };

  const handleRemove = (dropzone: 'front' | 'back', uid: string) => {
    const setFiles = dropzone === 'front' ? setFrontFiles : setBackFiles;
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  const renderDropzone = (
    label: string, 
    files: DropzoneFile[], 
    dropzone: 'front' | 'back',
    testId: string
  ) => (
    <div>
      <Text fw={500} size="sm" mb="xs">{label}</Text>
      <div data-testid={testId}>
        <Dropzone
          onDrop={() => {}}
          onClick={() => handleOpenPicker(dropzone)}
          accept={IMAGE_MIME_TYPE}
          maxFiles={1}
          style={{ cursor: 'pointer' }}
        >
          <Group justify="center" gap="sm" mih={80} style={{ pointerEvents: 'none' }}>
            <Dropzone.Idle>
              <IconPhoto size={28} stroke={1.5} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>
            <Dropzone.Accept>
              <IconUpload size={28} stroke={1.5} color="var(--mantine-color-blue-6)" />
            </Dropzone.Accept>

            <Text size="sm" c="dimmed">Click to upload</Text>
          </Group>
        </Dropzone>
      </div>
      
      {files.length > 0 && (
        <Stack gap="xs" mt="xs">
          {files.map(file => (
            <Group key={file.uid} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 4 }}>
              <div>
                <Text size="sm">{file.name}</Text>
                <Text size="xs" c={file.status === 'uploaded' ? 'green' : 'dimmed'}>
                  {file.status === 'uploaded' ? 'Uploaded' : 'Uploading...'}
                </Text>
              </div>
              <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleRemove(dropzone, file.uid)}>
                <IconX size={14} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}
    </div>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">ID Verification</Text>
      
      <SimpleGrid cols={2} spacing="md">
        {renderDropzone('Front of ID', frontFiles, 'front', 'dropzone-front-of-id')}
        {renderDropzone('Back of ID', backFiles, 'back', 'dropzone-back-of-id')}
      </SimpleGrid>

      <Modal opened={pickerOpen} onClose={() => { setPickerOpen(false); setActiveDropzone(null); }} title="Sample files" size="sm">
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
              <IconPhoto size={20} />
              <Text size="sm">{file.name}</Text>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </Card>
  );
}
