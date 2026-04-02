'use client';

/**
 * file_upload_button-mantine-T21: Upload a resume with Mantine FileButton
 *
 * setup_description: A centered isolated card titled "Resume" contains a Mantine FileButton 
 * wrapping a Mantine Button labeled "Upload resume". The FileButton opens the browser file 
 * picker and accepts a single PDF file. Below the button, a text line reads "Picked file: <name>" 
 * once a selection is made (otherwise it is hidden). Initial state: no file picked and no 
 * additional controls are present.
 *
 * Success: The FileButton-controlled input contains exactly one file named "resume.pdf".
 *          The on-page text shows that the picked file is resume.pdf.
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Text, Stack, Modal, UnstyledButton, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'resume.pdf', type: 'application/pdf' },
  { name: 'cv.pdf', type: 'application/pdf' },
  { name: 'cover_letter.pdf', type: 'application/pdf' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [pickerOpened, { open: openPicker, close: closePicker }] = useDisclosure(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (selectedFile === 'resume.pdf') {
      setCompleted(true);
      onSuccess();
    }
  }, [selectedFile, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    setSelectedFile(sample.name);
    closePicker();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">Resume</Text>
      
      <Stack gap="sm" data-testid="uploader-resume">
        <Button leftSection={<IconUpload size={16} />} onClick={openPicker}>
          Upload resume
        </Button>
        
        {selectedFile && (
          <Text size="sm" c="dimmed">
            Picked file: {selectedFile}
          </Text>
        )}
      </Stack>

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
                ':hover': { backgroundColor: 'var(--mantine-color-gray-1)' }
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
