'use client';

/**
 * rich_text_editor-mantine-v2-T16: Correct reply editor with list-plus-closing and send
 *
 * Inline surface with three stacked editors: Customer reply (empty), Internal note, Legal note.
 * In Customer reply, create ordered list ["Acknowledge issue", "Ship fix"] followed by
 * italic paragraph "— Support team". Leave others unchanged. Click "Send reply".
 */

import React, { useRef } from 'react';
import { Card, Text, Button, Group, Stack, Badge } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { textsMatch, normalizeText } from '../../types';

export default function T16({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const customerEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
  });

  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Remember to tag billing.</p>',
  });

  const legalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Do not promise compensation yet.</p>',
  });

  const handleSend = () => {
    if (!customerEditor || !internalEditor || !legalEditor || successFired.current) return;

    // Check non-target editors
    if (!textsMatch(internalEditor.getText(), 'Remember to tag billing.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(legalEditor.getText(), 'Do not promise compensation yet.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Check customer reply structure
    const json = customerEditor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 2) return;

    // Block 1: ordered list with 2 items
    if (content[0].type !== 'orderedList') return;
    const items = content[0].content || [];
    if (items.length !== 2) return;
    const expected = ['Acknowledge issue', 'Ship fix'];
    for (let i = 0; i < 2; i++) {
      if (items[i].type !== 'listItem') return;
      if (normalizeText(getListItemText(items[i])) !== expected[i]) return;
    }

    // Block 2: italic paragraph "— Support team"
    if (content[1].type !== 'paragraph') return;
    const paraText = normalizeText(getTextFromBlock(content[1]));
    if (paraText !== '— Support team' && paraText !== '\u2014 Support team') return;

    const html = customerEditor.getHTML();
    const italicMatches = html.match(/<em>([^<]*)<\/em>/g) || [];
    if (italicMatches.length < 1) return;
    const joinedItalic = normalizeText(italicMatches.map(m => m.replace(/<\/?em>/g, '')).join(' '));
    if (joinedItalic !== '— Support team' && joinedItalic !== '\u2014 Support team') return;

    successFired.current = true;
    onSuccess();
  };

  const editorConfigs = [
    { label: 'Customer reply', editor: customerEditor },
    { label: 'Internal note', editor: internalEditor },
    { label: 'Legal note', editor: legalEditor },
  ];

  return (
    <div style={{ padding: 16, width: 650 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">Support card</Text>
          <Badge color="orange" variant="light">Ticket #4412</Badge>
        </Group>
        <Text size="sm" c="dimmed" mb="sm">
          In "Customer reply": ordered list [Acknowledge issue, Ship fix] + italic "— Support team".
        </Text>

        <Stack gap="md">
          {editorConfigs.map(({ label, editor: ed }) => (
            <div key={label}>
              <Text fw={500} size="sm" mb={4}>{label}</Text>
              <RichTextEditor editor={ed}>
                <RichTextEditor.Toolbar sticky stickyOffset={0}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.BulletList />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
              </RichTextEditor>
            </div>
          ))}
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button onClick={handleSend}>Send reply</Button>
        </Group>
      </Card>
    </div>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((node: any) => node.text || '').join('');
}

function getListItemText(item: any): string {
  if (!item.content) return '';
  return item.content
    .flatMap((node: any) => {
      if (node.type === 'paragraph' && node.content) {
        return node.content.map((t: any) => t.text || '');
      }
      return node.text || '';
    })
    .join('');
}
