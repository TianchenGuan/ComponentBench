'use client';

/**
 * file_dropzone-mantine-T01: Upload a plain text note to Mantine Dropzone
 *
 * setup_description: Baseline scene: a centered isolated card in light theme with comfortable spacing and default scale.
 * The card contains one Mantine Dropzone instance labeled "Attach note".
 * The Dropzone displays the standard Mantine status messaging:
 * - Idle text: "Drag file here or click to select"
 * - Accept/Reject visual feedback when dragging a file over the zone
 * Configuration: accepts text files only (accept=text/plain, multiple=false, maxFiles=1) with a small size limit that all provided text files satisfy.
 * Clicking the dropzone opens an in-page "Sample files" picker listing:
 * - project-brief.txt   ← TARGET
 * - resume-alex-chen.pdf
 * - avatar-green.png
 * After selection, a simple file summary row appears under the Dropzone with filename text and status "uploaded", plus a remove action icon.
 * Initial state: empty.
 *
 * Success: The dropzone labeled "Attach note" contains exactly one file: project-brief.txt (status: uploaded).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, ActionIcon, Modal, UnstyledButton } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFile, IconX, IconFileText } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'project-brief.txt', type: 'text/plain' },
  { name: 'resume-alex-chen.pdf', type: 'application/pdf' },
  { name: 'avatar-green.png', type: 'image/png' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'project-brief.txt' &&
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
      <Text fw={500} size="lg" mb="md">Attach note</Text>
      
      <div data-testid="dropzone-attach-note">
        <Dropzone
          onDrop={() => {}}
          onClick={() => setPickerOpen(true)}
          accept={['text/plain']}
          maxFiles={1}
          style={{ cursor: 'pointer' }}
        >
          <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: 'none' }}>
            <Dropzone.Idle>
              <IconUpload size={40} stroke={1.5} color="var(--mantine-color-dimmed)" />
            </Dropzone.Idle>
            <Dropzone.Accept>
              <IconUpload size={40} stroke={1.5} color="var(--mantine-color-blue-6)" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={40} stroke={1.5} color="var(--mantine-color-red-6)" />
            </Dropzone.Reject>

            <div>
              <Text size="md" inline>
                Drag file here or click to select
              </Text>
              <Text size="xs" c="dimmed" inline mt={7}>
                Text files only
              </Text>
            </div>
          </Group>
        </Dropzone>
      </div>

      {files.length > 0 && (
        <Stack gap="xs" mt="md">
          {files.map(file => (
            <Group key={file.uid} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 4 }}>
              <Group gap="xs">
                <IconFileText size={20} />
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
                transition: 'background 0.1s',
              }}
              className="hover:bg-gray-100"
            >
              <IconFile size={20} />
              <Text size="sm">{file.name}</Text>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </Card>
  );
}
