'use client';

/**
 * rich_text_editor-mantine-T25: Match a multi-block reference card (dashboard)
 *
 * Dashboard layout with several tiles (charts are static placeholders) creates medium clutter.
 * One tile titled "Sprint brief" contains a RichTextEditor labeled "Sprint brief" starting empty.
 * Next to it is a read-only "Example" card (visual guidance only) showing:
 * - A centered Heading 2: "Sprint 12"
 * - An ordered (numbered) list with items "Fix bugs" and "Polish UI"
 * - A final paragraph with italic text: "Last updated: Feb 3"
 * Toolbar includes H2, alignment controls, OrderedList, and Italic.
 *
 * Success: The "Sprint brief" editor matches the Example: centered H2 "Sprint 12",
 * ordered list ["Fix bugs", "Polish UI"], and an italic paragraph "Last updated: Feb 3".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, SimpleGrid, Paper, Box, Group, RingProgress, Center } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import type { TaskComponentProps } from '../types';
import { normalizeText } from '../types';

const TARGET_ITEMS = ['Fix bugs', 'Polish UI'];

export default function T25({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
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

      if (content.length !== 3) return;
      
      // Block 1: heading with "Sprint 12"
      const block1 = content[0];
      if (block1.type !== 'heading') return;
      if (normalizeText(getTextFromBlock(block1)) !== 'Sprint 12') return;
      
      // Block 2: ordered list with target items
      const block2 = content[1];
      if (block2.type !== 'orderedList') return;
      const items = block2.content || [];
      if (items.length !== TARGET_ITEMS.length) return;
      for (let i = 0; i < TARGET_ITEMS.length; i++) {
        if (items[i].type !== 'listItem') return;
        if (normalizeText(getListItemText(items[i])) !== TARGET_ITEMS[i]) return;
      }
      
      // Block 3: paragraph with italic "Last updated: Feb 3"
      const block3 = content[2];
      if (block3.type !== 'paragraph') return;
      if (normalizeText(getTextFromBlock(block3)) !== 'Last updated: Feb 3') return;
      
      // Check at least some text in block3 has italic mark
      const hasItalic = (node: any): boolean => {
        if (node.marks?.some((m: any) => m.type === 'italic')) return true;
        if (node.content) return node.content.some(hasItalic);
        return false;
      };
      if (!hasItalic(block3)) return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <div style={{ width: '100%', maxWidth: 900 }} data-testid="dashboard">
      <Text fw={600} size="xl" mb="lg">
        Dashboard
      </Text>
      
      <SimpleGrid cols={2} spacing="md">
        {/* Metric Cards (clutter) */}
        <Paper p="md" radius="md" withBorder>
          <Text size="sm" c="dimmed" mb="xs">Sprint Progress</Text>
          <Group>
            <RingProgress
              size={60}
              thickness={6}
              sections={[{ value: 65, color: 'blue' }]}
              label={<Center><Text size="xs">65%</Text></Center>}
            />
            <div>
              <Text size="lg" fw={600}>65%</Text>
              <Text size="xs" c="dimmed">Complete</Text>
            </div>
          </Group>
        </Paper>
        
        <Paper p="md" radius="md" withBorder>
          <Text size="sm" c="dimmed" mb="xs">Open Issues</Text>
          <Text size="xl" fw={700}>23</Text>
          <Text size="xs" c="red">+5 this week</Text>
        </Paper>
        
        {/* Sprint Brief Editor (target) */}
        <Card shadow="sm" padding="md" radius="md" withBorder data-testid="sprint-brief-widget">
          <Text fw={500} mb="xs">Sprint brief (rich text)</Text>
          <Text size="xs" c="dimmed" mb="sm">Match Example</Text>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H2 />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="sprint-brief-editor" />
          </RichTextEditor>
        </Card>
        
        {/* Example Card */}
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
          <h2 style={{ margin: '0 0 8px 0', textAlign: 'center', fontSize: '1.25rem' }}>Sprint 12</h2>
          <ol style={{ margin: '0 0 8px 0', paddingLeft: '1.25rem' }}>
            <li>Fix bugs</li>
            <li>Polish UI</li>
          </ol>
          <p style={{ margin: 0, fontStyle: 'italic' }}>Last updated: Feb 3</p>
        </Box>
      </SimpleGrid>
    </div>
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
