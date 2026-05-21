'use client';

/**
 * rich_text_editor-mantine-T15: Find the signature editor and update it (dark settings panel)
 *
 * The page uses a settings_panel layout in dark theme with multiple collapsible sections
 * (Account, Notifications, Appearance). Above the fold are several toggles and dropdowns
 * as clutter (they are irrelevant).
 * The "Email signature" section is below the fold and contains one RichTextEditor labeled "Email signature".
 * The editor starts with: "Best," on one line and "Sam" on the next line.
 * No Save button is present; changes apply immediately, but the page shows a small "Saved" toast
 * after edits (non-blocking).
 *
 * Success: The "Email signature" editor plain text equals exactly two lines: "Thanks," then "Alex".
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Stack, Switch, Select, Collapse, Button, Group, Notification, rem } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconCheck } from '@tabler/icons-react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';

const TARGET_TEXT = 'Thanks,\nAlex';

export default function T15({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [accountOpen, setAccountOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(true);
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [signatureOpen, setSignatureOpen] = useState(true);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>Best,</p><p>Sam</p>',
    onUpdate: () => {
      // Show saved toast briefly
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);
    },
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const plainText = editor.getText();
      // Normalize line endings and trim
      const normalized = plainText.replace(/\r\n/g, '\n').trim();
      const target = TARGET_TEXT.trim();
      
      if (normalized === target) {
        successFired.current = true;
        onSuccess();
      }
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }} data-testid="settings-panel">
      <Text fw={600} size="xl" mb="lg">
        Settings (dark)
      </Text>

      {/* Account Section */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="sm">
        <Group justify="space-between" onClick={() => setAccountOpen(!accountOpen)} style={{ cursor: 'pointer' }}>
          <Text fw={500}>Account</Text>
          {accountOpen ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
        </Group>
        <Collapse in={accountOpen}>
          <Stack gap="sm" mt="md">
            <Switch label="Two-factor authentication" defaultChecked disabled />
            <Switch label="Email notifications for login" defaultChecked disabled />
          </Stack>
        </Collapse>
      </Card>

      {/* Notifications Section */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="sm">
        <Group justify="space-between" onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ cursor: 'pointer' }}>
          <Text fw={500}>Notifications</Text>
          {notificationsOpen ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
        </Group>
        <Collapse in={notificationsOpen}>
          <Stack gap="sm" mt="md">
            <Switch label="Push notifications" defaultChecked disabled />
            <Switch label="Weekly digest" disabled />
            <Select label="Frequency" data={['Daily', 'Weekly', 'Monthly']} defaultValue="Weekly" disabled />
          </Stack>
        </Collapse>
      </Card>

      {/* Appearance Section */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="sm">
        <Group justify="space-between" onClick={() => setAppearanceOpen(!appearanceOpen)} style={{ cursor: 'pointer' }}>
          <Text fw={500}>Appearance</Text>
          {appearanceOpen ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
        </Group>
        <Collapse in={appearanceOpen}>
          <Stack gap="sm" mt="md">
            <Select label="Theme" data={['Light', 'Dark', 'System']} defaultValue="Dark" disabled />
            <Select label="Font size" data={['Small', 'Medium', 'Large']} defaultValue="Medium" disabled />
          </Stack>
        </Collapse>
      </Card>

      {/* Email Signature Section (target) */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="sm" data-testid="email-signature-section">
        <Group justify="space-between" onClick={() => setSignatureOpen(!signatureOpen)} style={{ cursor: 'pointer' }}>
          <Text fw={500}>Email signature</Text>
          {signatureOpen ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
        </Group>
        <Collapse in={signatureOpen}>
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Target:<br />
              Thanks,<br />
              Alex
            </Text>
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content data-testid="email-signature-editor" />
            </RichTextEditor>
          </Stack>
        </Collapse>
      </Card>

      {/* Saved Toast */}
      {showSavedToast && (
        <Notification
          icon={<IconCheck style={{ width: rem(18), height: rem(18) }} />}
          color="teal"
          title="Saved"
          withCloseButton={false}
          style={{ position: 'fixed', bottom: 20, right: 20 }}
        >
          Your changes have been saved.
        </Notification>
      )}
    </div>
  );
}
