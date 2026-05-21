'use client';

/**
 * rich_text_editor-mantine-v2-T08: Clear formatting in the correct editor among four
 *
 * High-contrast settings panel. Four stacked editors: Public summary, Partner summary,
 * Rollback note, Internal escalation. Target: Partner summary — remove all formatting
 * from "Beta is available now." (initially Beta=bold, available=italic).
 * Leave others unchanged, click "Save panel".
 */

import React, { useRef } from 'react';
import { Card, Text, Button, Group, Stack, Badge } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const publicEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Highlight],
    content: '<p>No breaking changes.</p>',
  });

  const partnerEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Highlight],
    content: '<p><strong>Beta</strong> is <em>available</em> now.</p>',
  });

  const rollbackEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Highlight],
    content: '<p>Draft the rollback memo.</p>',
  });

  const escalationEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Highlight],
    content: '<p>Notify the on-call manager.</p>',
  });

  const handleSave = () => {
    if (!publicEditor || !partnerEditor || !rollbackEditor || !escalationEditor || successFired.current) return;

    // Check non-target editors unchanged
    if (!textsMatch(publicEditor.getText(), 'No breaking changes.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(rollbackEditor.getText(), 'Draft the rollback memo.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(escalationEditor.getText(), 'Notify the on-call manager.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Check partner summary
    if (!textsMatch(partnerEditor.getText(), 'Beta is available now.', { normalize: true, ignoreTrailingNewline: true })) return;

    const html = partnerEditor.getHTML();
    const hasFormatting = /<(strong|b|em|i|u|s|strike|del|mark|code)>/i.test(html);
    const hasLink = /<a\s/i.test(html);
    if (hasFormatting || hasLink) return;

    successFired.current = true;
    onSuccess();
  };

  const editorConfigs = [
    { label: 'Public summary', editor: publicEditor },
    { label: 'Partner summary', editor: partnerEditor },
    { label: 'Rollback note', editor: rollbackEditor },
    { label: 'Internal escalation', editor: escalationEditor },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16, width: 700 }}>
      <Card
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        style={{ width: 520, backgroundColor: '#1a1a2e', color: '#e0e0e0' }}
      >
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg" c="white">Partner communications</Text>
          <Badge color="red" variant="filled">High contrast</Badge>
        </Group>
        <Text size="sm" c="gray.4" mb="sm">
          Clear all formatting in "Partner summary" only. Leave others unchanged.
        </Text>

        <Stack gap="md">
          {editorConfigs.map(({ label, editor: ed }) => (
            <div key={label}>
              <Text fw={500} size="sm" mb={4} c="gray.3">{label}</Text>
              <RichTextEditor editor={ed}>
                <RichTextEditor.Toolbar sticky stickyOffset={0}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.ClearFormatting />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
              </RichTextEditor>
            </div>
          ))}
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button onClick={handleSave}>Save panel</Button>
        </Group>
      </Card>
    </div>
  );
}
