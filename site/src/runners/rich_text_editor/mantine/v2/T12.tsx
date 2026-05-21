'use client';

/**
 * rich_text_editor-mantine-v2-T12: Bubble-menu formatting in the correct service row
 *
 * Table with two rows: Auth and Billing. Each row has a compact editor with BubbleMenu (no toolbar).
 * In the Auth row, make only `blocked` bold in "Deploy is blocked today."
 * Leave Billing unchanged. Click Save in the Auth row.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Button, Table, Badge, Group, ActionIcon } from '@mantine/core';
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
    <div style={{ display: 'flex', gap: 4, padding: '2px 4px', background: '#f8f9fa', border: '1px solid #dee2e6', borderBottom: 'none', borderRadius: '4px 4px 0 0' }}>
      <ActionIcon size="xs" variant={editor.isActive('bold') ? 'filled' : 'default'} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold">
        <span style={{ fontWeight: 'bold', fontSize: 11 }}>B</span>
      </ActionIcon>
      <ActionIcon size="xs" variant={editor.isActive('italic') ? 'filled' : 'default'} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic">
        <span style={{ fontStyle: 'italic', fontSize: 11 }}>I</span>
      </ActionIcon>
    </div>
  );
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const authEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Deploy is blocked today.</p>',
  });

  const billingEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Ready to ship.</p>',
  });

  const handleSaveAuth = () => {
    if (!authEditor || !billingEditor || successFired.current) return;

    // Auth text preserved
    if (!textsMatch(authEditor.getText(), 'Deploy is blocked today.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Billing unchanged
    if (!textsMatch(billingEditor.getText(), 'Ready to ship.', { normalize: true, ignoreTrailingNewline: true })) return;

    const html = authEditor.getHTML();
    const boldMatches = html.match(/<strong>([^<]*)<\/strong>/g) || [];
    if (boldMatches.length !== 1 || !/<strong>\s*blocked\s*<\/strong>/.test(html)) return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: 16, width: 700 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 600 }}>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">Service status</Text>
          <Badge color="orange" variant="light">2 services</Badge>
        </Group>
        <Text size="sm" c="dimmed" mb="sm">
          In the Auth row, bold only "blocked" using the bubble menu. Leave Billing unchanged.
        </Text>

        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 90 }}>Service</Table.Th>
              <Table.Th>Status note</Table.Th>
              <Table.Th style={{ width: 80 }}>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td><Text fw={500} size="sm">Auth</Text></Table.Td>
              <Table.Td>
                <SelectionToolbar editor={authEditor} />
                <RichTextEditor editor={authEditor}>
                  <RichTextEditor.Content />
                </RichTextEditor>
              </Table.Td>
              <Table.Td>
                <Button size="xs" onClick={handleSaveAuth} data-testid="save-auth-row">Save</Button>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td><Text fw={500} size="sm">Billing</Text></Table.Td>
              <Table.Td>
                <SelectionToolbar editor={billingEditor} />
                <RichTextEditor editor={billingEditor}>
                  <RichTextEditor.Content />
                </RichTextEditor>
              </Table.Td>
              <Table.Td>
                <Button size="xs" variant="light" disabled>Save</Button>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
