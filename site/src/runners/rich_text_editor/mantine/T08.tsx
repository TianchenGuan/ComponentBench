'use client';

/**
 * rich_text_editor-mantine-T08: Insert a divider in compact small editor
 *
 * Scene remains an isolated centered card but uses compact spacing and small scale:
 * the toolbar buttons and padding are reduced.
 * One RichTextEditor labeled "Update" starts with two paragraphs:
 * 1) "Morning sync."
 * 2) "Afternoon demo."
 * The toolbar includes an "Hr" control (horizontal rule). In this configuration,
 * controls are tightly spaced, increasing click precision needs.
 *
 * Success: The editor has three blocks in order: paragraph "Morning sync.",
 * a horizontal rule, paragraph "Afternoon demo."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>Morning sync.</p><p>Afternoon demo.</p>',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const json = editor.getJSON();
      const content = json.content || [];
      
      // Should have exactly 3 blocks
      if (content.length !== 3) return;
      
      // Block 1: paragraph with "Morning sync."
      if (content[0].type !== 'paragraph') return;
      if (normalizeText(getTextFromBlock(content[0])) !== 'Morning sync.') return;
      
      // Block 2: horizontal rule
      if (content[1].type !== 'horizontalRule') return;
      
      // Block 3: paragraph with "Afternoon demo."
      if (content[2].type !== 'paragraph') return;
      if (normalizeText(getTextFromBlock(content[2])) !== 'Afternoon demo.') return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 400 }} data-testid="rte-update">
      <Text fw={600} size="md" mb="xs">
        Update
      </Text>
      <Text size="xs" c="dimmed" mb="xs">
        Add a horizontal line between the two paragraphs.
      </Text>
      <RichTextEditor editor={editor} styles={{ root: { fontSize: '0.875rem' } }}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Hr />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Card>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content
    .map((node: any) => node.text || '')
    .join('');
}
