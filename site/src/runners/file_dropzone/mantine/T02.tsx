'use client';

/**
 * file_dropzone-mantine-T02: Upload an image to Mantine Dropzone (profile photo)
 *
 * setup_description: Baseline scene: centered isolated card, light theme, comfortable spacing.
 * One Mantine Dropzone instance is labeled "Profile photo".
 * Configuration: accept=image/*, maxFiles=1. The Dropzone shows a large icon and helper text in Idle state.
 * Clicking opens an in-page "Sample files" picker listing:
 * - avatar-green.png   ← TARGET
 * - avatar-blue.png
 * - id-card.jpg
 * After the file is selected, the component renders a small preview thumbnail and a filename row under the dropzone with status "uploaded" and a remove action icon.
 * Initial state: empty.
 *
 * Success: The "Profile photo" dropzone contains exactly one file: avatar-green.png (status: uploaded).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, ActionIcon, Modal, UnstyledButton, Avatar } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'avatar-green.png', type: 'image/png' },
  { name: 'avatar-blue.png', type: 'image/png' },
  { name: 'id-card.jpg', type: 'image/jpeg' },
];

const getAvatarColor = (name: string): string => {
  if (name.includes('green')) return '#52c41a';
  if (name.includes('blue')) return '#1677ff';
  return '#999';
};

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'avatar-green.png' &&
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
      thumbUrl: getAvatarColor(sample.name),
    };
    
    setFiles([newFile]);
    
    await simulateUpload(500);
    setFiles([{ ...newFile, status: 'uploaded' }]);
  };

  const handleRemove = (uid: string) => {
    setFiles(prev => prev.filter(f => f.uid !== uid));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Profile photo</Text>
      
      <div data-testid="dropzone-profile-photo">
        <Dropzone
          onDrop={() => {}}
          onClick={() => setPickerOpen(true)}
          accept={IMAGE_MIME_TYPE}
          maxFiles={1}
          style={{ cursor: 'pointer' }}
        >
          <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>
            <Dropzone.Accept>
              <IconUpload size={50} stroke={1.5} color="var(--mantine-color-blue-6)" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} stroke={1.5} color="var(--mantine-color-red-6)" />
            </Dropzone.Reject>

            <div>
              <Text size="md" inline>
                Drag image here or click to select
              </Text>
              <Text size="xs" c="dimmed" inline mt={7}>
                Images only
              </Text>
            </div>
          </Group>
        </Dropzone>
      </div>

      {files.length > 0 && (
        <Stack gap="xs" mt="md">
          {files.map(file => (
            <Group key={file.uid} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 4 }}>
              <Group gap="sm">
                <Avatar color={file.thumbUrl} size="sm" />
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
              <Avatar color={getAvatarColor(file.name)} size="sm" />
              <Text size="sm">{file.name}</Text>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </Card>
  );
}
