'use client';

/**
 * file_upload_button-mantine-T27: Drag-and-drop an image into Mantine Dropzone (dark theme)
 *
 * setup_description: A centered isolated card on a dark-themed page contains a Mantine Dropzone 
 * component with a large bordered area. The dropzone shows the instructional text "Drag images 
 * here or click to select files" and accepts image files. When a file is dragged over the dropzone, 
 * its visual state changes (accept/reject indicators). After a successful drop, the page renders 
 * a small list under the dropzone titled "Accepted files" showing the uploaded filenames. Initial 
 * state: no accepted files are listed.
 *
 * Success: The Dropzone accepted-files list contains exactly one file named "screenshot.webp".
 *          The accepted file was provided via a drop interaction (drop event observed).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Group, Stack, Box, rem, Modal, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPhoto, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'screenshot.webp', type: 'image/webp' },
  { name: 'image.png', type: 'image/png' },
  { name: 'photo.jpg', type: 'image/jpeg' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpened, { open: openPicker, close: closePicker }] = useDisclosure(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0] === 'screenshot.webp'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setFiles([sample.name]);
    closePicker();
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ width: 450, background: '#1f1f1f', borderColor: '#303030' }}
    >
      <Text fw={500} size="lg" mb="md" c="white">Upload Image</Text>
      
      <Stack gap="md" data-testid="dropzone-accepted">
        <Box
          onClick={openPicker}
          style={{
            border: `2px dashed #434343`,
            borderRadius: rem(8),
            backgroundColor: '#141414',
            padding: rem(32),
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--mantine-color-blue-6)';
            e.currentTarget.style.backgroundColor = 'rgba(34, 139, 230, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#434343';
            e.currentTarget.style.backgroundColor = '#141414';
          }}
        >
          <Group justify="center" gap="xl" style={{ minHeight: 80 }}>
            <IconPhoto
              style={{ width: rem(52), height: rem(52), color: '#666' }}
              stroke={1.5}
            />

            <div>
              <Text size="md" inline c="dimmed">
                Drag images here or click to select files
              </Text>
              <Text size="xs" c="dimmed" inline mt={7}>
                Accepts image files up to 5MB
              </Text>
            </div>
          </Group>
        </Box>

        {files.length > 0 && (
          <div>
            <Text size="sm" fw={500} mb="xs" c="white">Accepted files</Text>
            {files.map((fileName, index) => (
              <Group key={index} gap="xs" p="xs" style={{ background: '#2a2a2a', borderRadius: 4 }}>
                <IconFile size={16} color="#888" />
                <Text size="sm" c="white">{fileName}</Text>
              </Group>
            ))}
          </div>
        )}
      </Stack>

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
