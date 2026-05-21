'use client';

/**
 * rich_text_editor-mantine-v2-T01: Bubble menu carryover in the correct blurb editor
 *
 * Settings panel with two editors "Public blurb" and "Incident blurb". BubbleMenu variant:
 * no fixed toolbar, selecting text reveals Bold/Italic controls near the selection.
 * Make `urgent` bold and `today` italic in Incident blurb, then click "Apply blurb".
 * Public blurb must remain unchanged.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Text, Button, Group, Stack, Switch, Badge, Divider, ActionIcon } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Editor } from '@tiptap/react';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

function SelectionToolbar({ editor }: { editor: Editor | null }) {
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const { from, to } = editor.state.selection;
      setHasSelection(from !== to);
    };
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  if (!editor || !hasSelection) return null;

  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px 6px', background: '#f8f9fa', border: '1px solid #dee2e6', borderBottom: 'none', borderRadius: '4px 4px 0 0' }}>
      <ActionIcon
        size="sm"
        variant={editor.isActive('bold') ? 'filled' : 'default'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <span style={{ fontWeight: 'bold', fontSize: 13 }}>B</span>
      </ActionIcon>
      <ActionIcon
        size="sm"
        variant={editor.isActive('italic') ? 'filled' : 'default'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <span style={{ fontStyle: 'italic', fontSize: 13 }}>I</span>
      </ActionIcon>
    </div>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);

  const publicEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Routine update only.</p>',
  });

  const incidentEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>This is urgent today.</p>',
  });

  const handleApply = () => {
    if (!publicEditor || !incidentEditor || successFired.current) return;
    setSaved(true);

    const publicText = publicEditor.getText();
    if (!textsMatch(publicText, 'Routine update only.', { normalize: true, ignoreTrailingNewline: true })) return;

    const incidentText = incidentEditor.getText();
    if (!textsMatch(incidentText, 'This is urgent today.', { normalize: true, ignoreTrailingNewline: true })) return;

    const html = incidentEditor.getHTML();
    const boldMatches = html.match(/<strong>[^<]*<\/strong>/g) || [];
    const italicMatches = html.match(/<em>[^<]*<\/em>/g) || [];

    const onlyUrgentBold = boldMatches.length === 1 && /<strong>\s*urgent\s*<\/strong>/.test(html);
    const onlyTodayItalic = italicMatches.length === 1 && /<em>\s*today\s*<\/em>/.test(html);

    if (onlyUrgentBold && onlyTodayItalic) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, width: 700 }}>
      <div style={{ flex: 1 }}>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Text fw={600} size="lg" mb="xs">Service blurbs</Text>
          <Group gap="xs" mb="md">
            <Badge size="sm" color="blue">Active</Badge>
            <Switch label="Auto-notify" size="xs" disabled defaultChecked />
          </Group>
          <Divider mb="md" />

          <Text size="sm" c="dimmed" mb="sm">
            Edit only "Incident blurb". Make <code>urgent</code> bold and <code>today</code> italic, then click "Apply blurb".
          </Text>

          <Stack gap="md">
            <div>
              <Text fw={500} size="sm" mb={4}>Public blurb</Text>
              <SelectionToolbar editor={publicEditor} />
              <RichTextEditor editor={publicEditor}>
                <RichTextEditor.Content />
              </RichTextEditor>
            </div>

            <div>
              <Text fw={500} size="sm" mb={4}>Incident blurb</Text>
              <SelectionToolbar editor={incidentEditor} />
              <RichTextEditor editor={incidentEditor}>
                <RichTextEditor.Content />
              </RichTextEditor>
            </div>
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button onClick={handleApply}>Apply blurb</Button>
          </Group>
        </Card>
      </div>

      <Stack gap="xs" style={{ width: 140 }}>
        <Badge color="gray" variant="outline" fullWidth>SLA: 99.9%</Badge>
        <Badge color="gray" variant="outline" fullWidth>Region: US-East</Badge>
        <Text size="xs" c="dimmed">Last sync: 2 min ago</Text>
      </Stack>
    </div>
  );
}
