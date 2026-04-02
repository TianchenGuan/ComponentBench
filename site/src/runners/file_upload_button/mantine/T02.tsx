'use client';

/**
 * file_upload_button-mantine-T22: Upload a profile photo with Mantine FileInput
 *
 * setup_description: A centered isolated card titled "Profile photo" contains a Mantine FileInput 
 * with an explicit visible label "Profile photo" and placeholder text "Select image". The FileInput 
 * is configured with accept="image/png,image/jpeg" and single-file mode (multiple=false). When a 
 * file is chosen, the input displays the filename inside the input field. Initial state: the input 
 * is empty (no selected file), and there is no clear button in this task.
 *
 * Success: The FileInput labeled "Profile photo" has exactly one selected file named "profile_photo.png".
 *          The displayed value shows profile_photo.png.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Modal, Stack, UnstyledButton, Group, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPhoto } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'profile_photo.png', type: 'image/png' },
  { name: 'avatar.jpg', type: 'image/jpeg' },
  { name: 'headshot.png', type: 'image/png' },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [pickerOpened, { open: openPicker, close: closePicker }] = useDisclosure(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === 'profile_photo.png') {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    closePicker();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Profile photo</Text>
      
      <div data-testid="uploader-profile-photo">
        <TextInput
          label="Profile photo"
          placeholder="Select image"
          value={selectedFile || ''}
          readOnly
          onClick={openPicker}
          leftSection={<IconPhoto size={16} />}
          styles={{ input: { cursor: 'pointer' } }}
        />
      </div>

      {/* Virtual file picker modal */}
      <Modal opened={pickerOpened} onClose={closePicker} title="Sample images" centered>
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
                <IconPhoto size={20} />
                <Text size="sm">{file.name}</Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </Card>
  );
}
