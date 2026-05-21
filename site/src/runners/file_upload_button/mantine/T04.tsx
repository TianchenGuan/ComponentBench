'use client';

/**
 * file_upload_button-mantine-T24: Upload to the correct FileInput in a form (2 instances)
 *
 * setup_description: The page is a simple identity form section with low clutter (a few text 
 * inputs plus file inputs). There are two Mantine FileInput components stacked vertically with 
 * labels "ID front" and "ID back". Both are single-file inputs that accept images and display 
 * the selected filename in the field. Initial state: both FileInputs are empty (no file selected). 
 * Only the FileInput labeled "ID front" should be filled for this task.
 *
 * Success: The FileInput labeled "ID front" has exactly one selected file named "id_front.jpg".
 *          The FileInput labeled "ID back" remains empty.
 */

import React, { useState, useEffect } from 'react';
import { TextInput, Card, Text, Stack, Divider, Modal, UnstyledButton, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPhoto } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const ID_FRONT_FILES: SampleFile[] = [
  { name: 'id_front.jpg', type: 'image/jpeg' },
  { name: 'passport_scan.png', type: 'image/png' },
  { name: 'license_front.jpg', type: 'image/jpeg' },
];

const ID_BACK_FILES: SampleFile[] = [
  { name: 'id_back.jpg', type: 'image/jpeg' },
  { name: 'license_back.jpg', type: 'image/jpeg' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [idFrontFile, setIdFrontFile] = useState<string | null>(null);
  const [idBackFile, setIdBackFile] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [frontPickerOpened, { open: openFrontPicker, close: closeFrontPicker }] = useDisclosure(false);
  const [backPickerOpened, { open: openBackPicker, close: closeBackPicker }] = useDisclosure(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      idFrontFile === 'id_front.jpg' &&
      idBackFile === null
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [idFrontFile, idBackFile, completed, onSuccess]);

  const handleSelectFrontFile = (sample: SampleFile) => {
    setIdFrontFile(sample.name);
    closeFrontPicker();
  };

  const handleSelectBackFile = (sample: SampleFile) => {
    setIdBackFile(sample.name);
    closeBackPicker();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Identity Verification</Text>
      
      <Stack gap="md">
        {/* Form fields - distractors */}
        <TextInput label="Full Name" defaultValue="John Doe" />
        <TextInput label="Date of Birth" defaultValue="1990-01-15" />
        
        <Divider my="xs" />
        
        {/* ID front uploader - target */}
        <div data-testid="uploader-id-front">
          <TextInput
            label="ID front"
            placeholder="Select image"
            value={idFrontFile || ''}
            readOnly
            onClick={openFrontPicker}
            leftSection={<IconPhoto size={16} />}
            styles={{ input: { cursor: 'pointer' } }}
          />
        </div>
        
        {/* ID back uploader - distractor */}
        <div data-testid="uploader-id-back">
          <TextInput
            label="ID back"
            placeholder="Select image"
            value={idBackFile || ''}
            readOnly
            onClick={openBackPicker}
            leftSection={<IconPhoto size={16} />}
            styles={{ input: { cursor: 'pointer' } }}
          />
        </div>
      </Stack>

      {/* ID front picker modal */}
      <Modal opened={frontPickerOpened} onClose={closeFrontPicker} title="Sample images" centered>
        <Stack gap="xs">
          {ID_FRONT_FILES.map((file) => (
            <UnstyledButton
              key={file.name}
              onClick={() => handleSelectFrontFile(file)}
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

      {/* ID back picker modal */}
      <Modal opened={backPickerOpened} onClose={closeBackPicker} title="Sample images" centered>
        <Stack gap="xs">
          {ID_BACK_FILES.map((file) => (
            <UnstyledButton
              key={file.name}
              onClick={() => handleSelectBackFile(file)}
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
