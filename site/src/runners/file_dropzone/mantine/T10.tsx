'use client';

/**
 * file_dropzone-mantine-T10: Upload the correct press kit PDF in a cluttered dashboard
 *
 * setup_description: The page is a marketing dashboard (light theme, comfortable spacing) with high clutter: multiple cards show metrics, charts, and action buttons.
 * Among these cards is one "Press kit" card containing a Mantine Dropzone labeled "Press kit" (accept=.pdf, maxFiles=1).
 * The Dropzone is in its Idle state and supports click-to-open an in-page picker.
 * The picker lists several similarly named documents:
 * - press-kit-2025.pdf
 * - press-kit-2026.pdf   ← TARGET
 * - press-release-2026.pdf
 * - media-assets.zip
 * After selection, the Press kit card displays a single file row with filename and uploaded status.
 * Initial state: empty. No further "Save" button is required; attaching the correct file completes the task.
 *
 * Success: The "Press kit" dropzone contains exactly one file: press-kit-2026.pdf with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group, ActionIcon, Modal, UnstyledButton, SimpleGrid, Box, Badge, Progress } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFile, IconX, IconUsers, IconCash, IconEye, IconClick, IconFileZip } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'press-kit-2025.pdf', type: 'application/pdf' },
  { name: 'press-kit-2026.pdf', type: 'application/pdf' },
  { name: 'press-release-2026.pdf', type: 'application/pdf' },
  { name: 'media-assets.zip', type: 'application/zip' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'press-kit-2026.pdf' &&
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

  // Stat card component for clutter
  const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Group>
        <Box style={{ color }}>{icon}</Box>
        <div>
          <Text size="xs" c="dimmed">{label}</Text>
          <Text fw={600}>{value}</Text>
        </div>
      </Group>
    </Card>
  );

  return (
    <Box style={{ width: 600 }}>
      {/* Dashboard clutter - stat cards */}
      <SimpleGrid cols={4} spacing="sm" mb="md">
        <StatCard icon={<IconUsers size={24} />} label="Visitors" value="12.4k" color="var(--mantine-color-blue-6)" />
        <StatCard icon={<IconCash size={24} />} label="Revenue" value="$8.2k" color="var(--mantine-color-green-6)" />
        <StatCard icon={<IconEye size={24} />} label="Page Views" value="45.2k" color="var(--mantine-color-violet-6)" />
        <StatCard icon={<IconClick size={24} />} label="Clicks" value="3.1k" color="var(--mantine-color-orange-6)" />
      </SimpleGrid>

      {/* Chart placeholder */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Text fw={500} size="sm" mb="sm">Campaign Performance</Text>
        <Box style={{ display: 'flex', alignItems: 'end', gap: 8, height: 60 }}>
          {[45, 72, 55, 89, 67, 78, 92].map((h, i) => (
            <Box 
              key={i} 
              style={{ 
                flex: 1, 
                background: 'var(--mantine-color-blue-6)', 
                height: `${h}%`, 
                borderRadius: '2px 2px 0 0' 
              }} 
            />
          ))}
        </Box>
      </Card>

      {/* More clutter */}
      <SimpleGrid cols={2} spacing="md" mb="md">
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} size="sm" mb="sm">Top Channels</Text>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs">Organic Search</Text>
              <Badge size="xs">42%</Badge>
            </Group>
            <Progress value={42} size="xs" />
            <Group justify="space-between">
              <Text size="xs">Social Media</Text>
              <Badge size="xs">28%</Badge>
            </Group>
            <Progress value={28} size="xs" />
          </Stack>
        </Card>
        
        {/* TARGET: Press kit card */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={500} size="sm" mb="sm">Press kit</Text>
          
          <div data-testid="dropzone-press-kit">
            <Dropzone
              onDrop={() => {}}
              onClick={() => setPickerOpen(true)}
              accept={['application/pdf']}
              maxFiles={1}
              style={{ cursor: 'pointer' }}
              p="sm"
            >
              <Group justify="center" mih={50} style={{ pointerEvents: 'none' }}>
                <Dropzone.Idle>
                  <IconUpload size={24} stroke={1.5} color="var(--mantine-color-dimmed)" />
                </Dropzone.Idle>
                <Text size="xs" c="dimmed">Upload PDF</Text>
              </Group>
            </Dropzone>
          </div>
          
          {files.length > 0 && (
            <Group justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 4 }} mt="sm">
              <Group gap="xs">
                <IconFile size={16} color="red" />
                <div>
                  <Text size="xs">{files[0].name}</Text>
                  <Text size="xs" c={files[0].status === 'uploaded' ? 'green' : 'dimmed'}>
                    {files[0].status === 'uploaded' ? 'Uploaded' : 'Uploading...'}
                  </Text>
                </div>
              </Group>
              <ActionIcon variant="subtle" color="gray" size="xs" onClick={() => handleRemove(files[0].uid)}>
                <IconX size={12} />
              </ActionIcon>
            </Group>
          )}
        </Card>
      </SimpleGrid>

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
              {file.name.endsWith('.zip') ? <IconFileZip size={20} /> : <IconFile size={20} color="red" />}
              <Text size="sm">{file.name}</Text>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </Box>
  );
}
