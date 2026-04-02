'use client';

/**
 * rich_text_editor-mantine-v2-T15: Below-the-fold signature update with exact bold second line
 *
 * Dark settings panel with high clutter. The editor "Email signature" is below the fold.
 * Initially contains "Best," and "Sam". Change to "Thanks," and bold "Alex".
 * Click "Save signature".
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Button, Group, Stack, Switch, Select, Collapse } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

export default function T15({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [accountOpen, setAccountOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(true);
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [securityOpen, setSecurityOpen] = useState(true);
  const [signatureOpen, setSignatureOpen] = useState(true);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Best,</p><p>Sam</p>',
  });

  const handleSave = () => {
    if (!editor || successFired.current) return;

    const json = editor.getJSON();
    const content = json.content || [];
    const nonEmpty = content.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (nonEmpty.length < 2) return;

    // Find the paragraph containing "Thanks," and the paragraph containing bold "Alex"
    let thanksIdx = -1;
    let alexIdx = -1;
    for (let i = 0; i < nonEmpty.length; i++) {
      const block = nonEmpty[i];
      if (block.type !== 'paragraph') continue;
      const text = normalizeText(getTextFromBlock(block));
      if (text === 'Thanks,' && thanksIdx === -1) thanksIdx = i;
      if (text === 'Alex' && alexIdx === -1) alexIdx = i;
    }

    if (thanksIdx === -1 || alexIdx === -1 || alexIdx <= thanksIdx) return;

    // Between them, only empty paragraphs allowed
    for (let i = thanksIdx + 1; i < alexIdx; i++) {
      const mid = nonEmpty[i];
      if (mid.type !== 'paragraph') return;
      if (normalizeText(getTextFromBlock(mid)) !== '') return;
    }

    // "Alex" must be fully bold
    const html = editor.getHTML();
    if (!/<strong>Alex<\/strong>/.test(html) && !/<b>Alex<\/b>/.test(html)) return;

    // "Thanks," must NOT be bold
    if (/<strong>Thanks,<\/strong>/.test(html) || /<b>Thanks,<\/b>/.test(html)) return;

    successFired.current = true;
    onSuccess();
  };

  const sections = [
    {
      title: 'Account',
      open: accountOpen,
      toggle: () => setAccountOpen(!accountOpen),
      content: (
        <Stack gap="sm" mt="md">
          <Switch label="Two-factor authentication" defaultChecked disabled />
          <Switch label="Email notifications for login" defaultChecked disabled />
        </Stack>
      ),
    },
    {
      title: 'Notifications',
      open: notificationsOpen,
      toggle: () => setNotificationsOpen(!notificationsOpen),
      content: (
        <Stack gap="sm" mt="md">
          <Switch label="Push notifications" defaultChecked disabled />
          <Switch label="Weekly digest" disabled />
          <Select label="Frequency" data={['Daily', 'Weekly', 'Monthly']} defaultValue="Weekly" disabled />
        </Stack>
      ),
    },
    {
      title: 'Appearance',
      open: appearanceOpen,
      toggle: () => setAppearanceOpen(!appearanceOpen),
      content: (
        <Stack gap="sm" mt="md">
          <Select label="Theme" data={['Light', 'Dark', 'System']} defaultValue="Dark" disabled />
          <Select label="Font size" data={['Small', 'Medium', 'Large']} defaultValue="Medium" disabled />
        </Stack>
      ),
    },
    {
      title: 'Security',
      open: securityOpen,
      toggle: () => setSecurityOpen(!securityOpen),
      content: (
        <Stack gap="sm" mt="md">
          <Switch label="Session timeout" disabled defaultChecked />
          <Select label="Timeout duration" data={['15 min', '30 min', '1 hour']} defaultValue="30 min" disabled />
        </Stack>
      ),
    },
  ];

  return (
    <div
      style={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: 16, backgroundColor: '#1a1b1e', minHeight: '100vh' }}
      data-mantine-color-scheme="dark"
    >
      <Text fw={600} size="xl" mb="lg" c="white">Settings</Text>

      {sections.map((s) => (
        <Card key={s.title} shadow="sm" padding="md" radius="md" withBorder mb="sm" bg="dark.6">
          <Group justify="space-between" onClick={s.toggle} style={{ cursor: 'pointer' }}>
            <Text fw={500} c="white">{s.title}</Text>
            {s.open ? <IconChevronDown size={16} color="#aaa" /> : <IconChevronRight size={16} color="#aaa" />}
          </Group>
          <Collapse in={s.open}>{s.content}</Collapse>
        </Card>
      ))}

      <Card shadow="sm" padding="md" radius="md" withBorder mb="sm" bg="dark.6">
        <Group justify="space-between" onClick={() => setSignatureOpen(!signatureOpen)} style={{ cursor: 'pointer' }}>
          <Text fw={500} c="white">Email signature</Text>
          {signatureOpen ? <IconChevronDown size={16} color="#aaa" /> : <IconChevronRight size={16} color="#aaa" />}
        </Group>
        <Collapse in={signatureOpen}>
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Change to: Thanks, / bold Alex
            </Text>
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
            <Group justify="flex-end">
              <Button onClick={handleSave}>Save signature</Button>
            </Group>
          </Stack>
        </Collapse>
      </Card>
    </div>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((node: any) => node.text || '').join('');
}
