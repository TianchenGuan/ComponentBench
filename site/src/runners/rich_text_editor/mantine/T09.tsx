'use client';

/**
 * rich_text_editor-mantine-T09: Match a simple formatted example (mixed guidance)
 *
 * Baseline isolated card centered. Two side-by-side panels inside the card:
 * - Left: RichTextEditor labeled "Roadmap draft" (starts empty).
 * - Right: a non-editable "Example" preview card showing the target formatting.
 * The Example shows:
 * • A Heading 3 line: "Roadmap"
 * • A bulleted list with two items: "Ship v1" and "Collect feedback"
 * Guidance is mixed: the instruction says "match the Example card", and the card is visible
 * as a visual reference.
 *
 * Success: The "Roadmap draft" editor matches the Example card: a Heading 3 "Roadmap"
 * followed by a bullet list with two items "Ship v1" and "Collect feedback".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Grid, Box } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

const TARGET_ITEMS = ['Ship v1', 'Collect feedback'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const json = editor.getJSON();
      const allContent = json.content || [];

      const content = allContent.filter(
        (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
      );

      if (content.length !== 2) return;
      
      const heading = content[0];
      if (heading.type !== 'heading') return;
      if (normalizeText(getTextFromBlock(heading)) !== 'Roadmap') return;
      
      const bulletList = content[1];
      if (bulletList.type !== 'bulletList') return;
      
      const items = bulletList.content || [];
      if (items.length !== TARGET_ITEMS.length) return;
      
      for (let i = 0; i < TARGET_ITEMS.length; i++) {
        const item = items[i];
        if (item.type !== 'listItem') return;
        if (normalizeText(getListItemText(item)) !== TARGET_ITEMS[i]) return;
      }
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="rte-roadmap-draft">
      <Text fw={600} size="lg" mb="md">
        Roadmap draft
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Match the Example card on the right.
      </Text>
      
      <Grid>
        <Grid.Col span={7}>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
        </Grid.Col>
        
        <Grid.Col span={5}>
          <Box
            p="md"
            style={{
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: 'var(--mantine-radius-md)',
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
            data-testid="example-card"
          >
            <Text size="sm" fw={500} c="dimmed" mb="sm">Example</Text>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Roadmap</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              <li>Ship v1</li>
              <li>Collect feedback</li>
            </ul>
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content
    .map((node: any) => node.text || '')
    .join('');
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
