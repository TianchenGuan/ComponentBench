'use client';

/**
 * rich_text_editor-mantine-v2-T07: Three-step carryover formatting with save
 *
 * Settings panel with high clutter. One editor "Reminder" with text
 * "Please review the Q1 plan today." — highlight `Q1`, inline-code `plan`, italic `today`.
 * Then click "Apply reminder".
 */

import React, { useRef } from 'react';
import { Card, Text, Button, Group, Stack, Switch, Badge, SegmentedControl, Divider } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Highlight, CodeExtension],
    content: '<p>Please review the Q1 plan today.</p>',
  });

  const handleApply = () => {
    if (!editor || successFired.current) return;

    const plainText = editor.getText();
    if (!textsMatch(plainText, 'Please review the Q1 plan today.', { normalize: true, ignoreTrailingNewline: true })) return;

    const html = editor.getHTML();

    // Check highlight on Q1 only
    const highlightMatches = html.match(/<mark[^>]*>([^<]*)<\/mark>/g) || [];
    if (highlightMatches.length !== 1 || !/<mark[^>]*>\s*Q1\s*<\/mark>/.test(html)) return;

    // Check code on plan only
    const codeMatches = html.match(/<code>([^<]*)<\/code>/g) || [];
    if (codeMatches.length !== 1 || !/<code>\s*plan\s*<\/code>/.test(html)) return;

    // Check italic on today only
    const italicMatches = html.match(/<em>([^<]*)<\/em>/g) || [];
    if (italicMatches.length !== 1 || !/<em>\s*today\s*<\/em>/.test(html)) return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, width: 700 }}>
      <Stack gap="xs" style={{ width: 160 }}>
        <Badge color="yellow" variant="light" fullWidth>Status: Review</Badge>
        <Switch label="Auto-save" size="xs" disabled defaultChecked />
        <Switch label="Notify team" size="xs" disabled />
        <SegmentedControl data={['Draft', 'Review', 'Final']} defaultValue="Review" size="xs" disabled />
        <Card withBorder p="xs">
          <Text size="xs" c="dimmed">Priority</Text>
          <Badge color="red" size="sm">High</Badge>
        </Card>
        <Card withBorder p="xs">
          <Text size="xs" c="dimmed">Assigned to</Text>
          <Text size="xs">Platform team</Text>
        </Card>
      </Stack>

      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
        <Text fw={600} size="lg" mb="xs">Reminder</Text>
        <Text size="sm" c="dimmed" mb="sm">
          Highlight <code>Q1</code>, inline-code <code>plan</code>, italic <code>today</code>.
        </Text>

        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={0}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content />
        </RichTextEditor>

        <Divider my="sm" />
        <Group justify="flex-end">
          <Button onClick={handleApply}>Apply reminder</Button>
        </Group>
      </Card>
    </div>
  );
}
