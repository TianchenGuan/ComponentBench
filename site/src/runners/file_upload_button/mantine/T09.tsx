'use client';

/**
 * file_upload_button-mantine-T29: Clear the Banner file using a small Reset control (3 instances)
 *
 * setup_description: The page is a compact form section titled "Assets" containing three side-by-side 
 * upload controls (same canonical type) built with Mantine FileButton. Each uploader has a heading 
 * label: "Avatar image", "Banner image", and "Document". Under each label there is a Button labeled 
 * "Upload" (FileButton) and a small red "Reset" action (a compact button or action icon) that clears 
 * the selection via the FileButton resetRef pattern. Initial state: Avatar image already has 
 * "avatar.jpg" selected, Banner image already has "banner.png" selected, and Document already has 
 * "resume.pdf" selected; each selection is shown as a text line "Picked file: <name>" under its 
 * uploader. The task is only to clear the Banner image selection; other two must remain unchanged.
 *
 * Success: The uploader labeled "Banner image" has no selected file (0 files).
 *          The uploaders labeled "Avatar image" and "Document" still show their original selected files.
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Text, Group, Stack, ActionIcon, Modal, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload, IconX, IconPhoto, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const AVATAR_FILES: SampleFile[] = [
  { name: 'avatar.jpg', type: 'image/jpeg' },
  { name: 'profile.png', type: 'image/png' },
];

const BANNER_FILES: SampleFile[] = [
  { name: 'banner.png', type: 'image/png' },
  { name: 'header.jpg', type: 'image/jpeg' },
];

const DOCUMENT_FILES: SampleFile[] = [
  { name: 'resume.pdf', type: 'application/pdf' },
  { name: 'cv.pdf', type: 'application/pdf' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [avatarFile, setAvatarFile] = useState<string | null>('avatar.jpg');
  const [bannerFile, setBannerFile] = useState<string | null>('banner.png');
  const [documentFile, setDocumentFile] = useState<string | null>('resume.pdf');
  const [completed, setCompleted] = useState(false);
  
  const [avatarPickerOpened, { open: openAvatarPicker, close: closeAvatarPicker }] = useDisclosure(false);
  const [bannerPickerOpened, { open: openBannerPicker, close: closeBannerPicker }] = useDisclosure(false);
  const [documentPickerOpened, { open: openDocumentPicker, close: closeDocumentPicker }] = useDisclosure(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      bannerFile === null &&
      avatarFile === 'avatar.jpg' &&
      documentFile === 'resume.pdf'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [avatarFile, bannerFile, documentFile, completed, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={500} size="lg" mb="md">Assets</Text>
      
      <Group align="flex-start" gap="lg">
        {/* Avatar image */}
        <Stack gap="xs" style={{ flex: 1 }} data-testid="uploader-avatar">
          <Text size="sm" fw={500}>Avatar image</Text>
          <Button size="xs" leftSection={<IconUpload size={14} />} onClick={openAvatarPicker}>
            Upload
          </Button>
          {avatarFile && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">Picked file: {avatarFile}</Text>
              <ActionIcon 
                size="xs" 
                color="red" 
                variant="subtle"
                onClick={() => setAvatarFile(null)}
              >
                <IconX size={12} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
        
        {/* Banner image - target */}
        <Stack gap="xs" style={{ flex: 1 }} data-testid="uploader-banner">
          <Text size="sm" fw={500}>Banner image</Text>
          <Button size="xs" leftSection={<IconUpload size={14} />} onClick={openBannerPicker}>
            Upload
          </Button>
          {bannerFile && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">Picked file: {bannerFile}</Text>
              <ActionIcon 
                size="xs" 
                color="red" 
                variant="subtle"
                onClick={() => setBannerFile(null)}
              >
                <IconX size={12} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
        
        {/* Document */}
        <Stack gap="xs" style={{ flex: 1 }} data-testid="uploader-document">
          <Text size="sm" fw={500}>Document</Text>
          <Button size="xs" leftSection={<IconUpload size={14} />} onClick={openDocumentPicker}>
            Upload
          </Button>
          {documentFile && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">Picked file: {documentFile}</Text>
              <ActionIcon 
                size="xs" 
                color="red" 
                variant="subtle"
                onClick={() => setDocumentFile(null)}
              >
                <IconX size={12} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Group>

      {/* Avatar picker modal */}
      <Modal opened={avatarPickerOpened} onClose={closeAvatarPicker} title="Sample images" centered>
        <Stack gap="xs">
          {AVATAR_FILES.map((file) => (
            <UnstyledButton
              key={file.name}
              onClick={() => { setAvatarFile(file.name); closeAvatarPicker(); }}
              style={{ padding: '12px', borderRadius: '4px' }}
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

      {/* Banner picker modal */}
      <Modal opened={bannerPickerOpened} onClose={closeBannerPicker} title="Sample images" centered>
        <Stack gap="xs">
          {BANNER_FILES.map((file) => (
            <UnstyledButton
              key={file.name}
              onClick={() => { setBannerFile(file.name); closeBannerPicker(); }}
              style={{ padding: '12px', borderRadius: '4px' }}
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

      {/* Document picker modal */}
      <Modal opened={documentPickerOpened} onClose={closeDocumentPicker} title="Sample files" centered>
        <Stack gap="xs">
          {DOCUMENT_FILES.map((file) => (
            <UnstyledButton
              key={file.name}
              onClick={() => { setDocumentFile(file.name); closeDocumentPicker(); }}
              style={{ padding: '12px', borderRadius: '4px' }}
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
