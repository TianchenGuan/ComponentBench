'use client';

/**
 * file_dropzone-mantine-T07: Scroll inside a drawer to upload a support bundle ZIP
 *
 * setup_description: A drawer is open from the right side of the screen (drawer_flow layout; placement=top_right anchor), on a light-theme page.
 * The drawer content is scrollable and starts at the top.
 * The drawer contains multiple sections (Account, Notifications, Privacy) with toggles and selects (distractors).
 * The target section "Support bundle" is near the bottom of the drawer and is not visible initially without scrolling the drawer.
 * In "Support bundle", there is one Mantine Dropzone labeled "Upload support bundle" configured as:
 * accept=.zip, maxFiles=1, auto-upload with a short progress indicator.
 * Clicking the Dropzone opens an in-page picker listing 4 similar zip files:
 * - support-bundle-2026-01-31.zip
 * - support-bundle-2026-02-01.zip   ← TARGET
 * - support-bundle-2026-02-02.zip
 * - support-screenshots.zip
 * Initial state: empty; drawer scroll position at top.
 *
 * Success: The "Upload support bundle" dropzone contains exactly one file: support-bundle-2026-02-01.zip with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Drawer, Text, Stack, Group, ActionIcon, Switch, Select, Modal, UnstyledButton, ScrollArea, Divider } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconFile, IconX, IconFileZip } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'support-bundle-2026-01-31.zip', type: 'application/zip' },
  { name: 'support-bundle-2026-02-01.zip', type: 'application/zip' },
  { name: 'support-bundle-2026-02-02.zip', type: 'application/zip' },
  { name: 'support-screenshots.zip', type: 'application/zip' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'support-bundle-2026-02-01.zip' &&
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
    <>
      {/* Background placeholder */}
      <div style={{ padding: 24, color: '#999' }}>
        <Text>Main page content (drawer is open)</Text>
      </div>

      {/* Drawer - always open */}
      <Drawer
        opened={true}
        onClose={() => {}}
        position="right"
        title="Support"
        size="md"
        withCloseButton={false}
      >
        <ScrollArea style={{ height: 'calc(100vh - 100px)' }}>
          <Stack gap="lg">
            {/* Account Section */}
            <div>
              <Text fw={500} mb="sm">Account</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Two-factor auth</Text>
                  <Switch size="sm" />
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Email notifications</Text>
                  <Switch size="sm" defaultChecked />
                </Group>
              </Stack>
            </div>
            
            <Divider />
            
            {/* Notifications Section */}
            <div>
              <Text fw={500} mb="sm">Notifications</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Push notifications</Text>
                  <Switch size="sm" defaultChecked />
                </Group>
                <Select 
                  label="Frequency"
                  size="sm"
                  defaultValue="daily"
                  data={['realtime', 'hourly', 'daily', 'weekly']}
                />
              </Stack>
            </div>
            
            <Divider />
            
            {/* Privacy Section */}
            <div>
              <Text fw={500} mb="sm">Privacy</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Share analytics</Text>
                  <Switch size="sm" />
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Crash reports</Text>
                  <Switch size="sm" defaultChecked />
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Profile visible</Text>
                  <Switch size="sm" defaultChecked />
                </Group>
              </Stack>
            </div>
            
            <Divider />
            
            {/* More padding sections to push target below fold */}
            <div>
              <Text fw={500} mb="sm">Appearance</Text>
              <Stack gap="xs">
                <Select 
                  label="Theme"
                  size="sm"
                  defaultValue="system"
                  data={['light', 'dark', 'system']}
                />
                <Select 
                  label="Language"
                  size="sm"
                  defaultValue="en"
                  data={['en', 'es', 'fr', 'de']}
                />
              </Stack>
            </div>
            
            <Divider />
            
            {/* TARGET: Support bundle section */}
            <div>
              <Text fw={500} mb="sm">Support bundle</Text>
              <Text size="xs" c="dimmed" mb="sm">
                Upload diagnostic logs for support
              </Text>
              
              <div data-testid="dropzone-upload-support-bundle">
                <Dropzone
                  onDrop={() => {}}
                  onClick={() => setPickerOpen(true)}
                  accept={['application/zip']}
                  maxFiles={1}
                  style={{ cursor: 'pointer' }}
                >
                  <Group justify="center" gap="sm" mih={80} style={{ pointerEvents: 'none' }}>
                    <Dropzone.Idle>
                      <IconUpload size={28} stroke={1.5} color="var(--mantine-color-dimmed)" />
                    </Dropzone.Idle>

                    <Text size="sm" c="dimmed">Click to upload ZIP</Text>
                  </Group>
                </Dropzone>
              </div>
              
              {files.length > 0 && (
                <Stack gap="xs" mt="sm">
                  {files.map(file => (
                    <Group key={file.uid} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 4 }}>
                      <Group gap="xs">
                        <IconFileZip size={18} />
                        <div>
                          <Text size="sm">{file.name}</Text>
                          <Text size="xs" c={file.status === 'uploaded' ? 'green' : 'dimmed'}>
                            {file.status === 'uploaded' ? 'Uploaded' : 'Uploading...'}
                          </Text>
                        </div>
                      </Group>
                      <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleRemove(file.uid)}>
                        <IconX size={14} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              )}
            </div>
          </Stack>
        </ScrollArea>
      </Drawer>

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
              <IconFileZip size={20} />
              <Text size="sm">{file.name}</Text>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </>
  );
}
