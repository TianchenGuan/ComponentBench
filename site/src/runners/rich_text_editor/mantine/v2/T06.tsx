'use client';

/**
 * rich_text_editor-mantine-v2-T06: Reconstruct a visual reference card and save
 *
 * Dashboard panel with high clutter. Empty editor "Sprint brief" beside a read-only Example card.
 * Example shows: centered H2 "Sprint 12", ordered list ["Fix bugs", "Polish UI"],
 * italic paragraph "Last updated: Feb 3". Click "Save brief" after matching.
 */

import React, { useRef } from 'react';
import { Card, Text, Button, Group, Stack, Paper, Badge } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });

  const handleSave = () => {
    if (!editor || successFired.current) return;

    const json = editor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 3) return;

    // Block 1: H2 "Sprint 12" centered
    const heading = content[0];
    if (heading.type !== 'heading' || heading.attrs?.level !== 2) return;
    if (heading.attrs?.textAlign !== 'center') return;
    if (normalizeText(getTextFromBlock(heading)) !== 'Sprint 12') return;

    // Block 2: ordered list with 2 items
    const orderedList = content[1];
    if (orderedList.type !== 'orderedList') return;
    const items = orderedList.content || [];
    if (items.length !== 2) return;
    const expectedItems = ['Fix bugs', 'Polish UI'];
    for (let i = 0; i < 2; i++) {
      if (items[i].type !== 'listItem') return;
      if (normalizeText(getListItemText(items[i])) !== expectedItems[i]) return;
    }

    // Block 3: italic paragraph "Last updated: Feb 3"
    const para = content[2];
    if (para.type !== 'paragraph') return;
    if (normalizeText(getTextFromBlock(para)) !== 'Last updated: Feb 3') return;

    const html = editor.getHTML();
    const italicRegex = /<em>([^<]*)<\/em>/g;
    const italicMatches: string[] = [];
    let m;
    while ((m = italicRegex.exec(html)) !== null) {
      italicMatches.push(m[1]);
    }
    if (italicMatches.length < 1) return;
    const joinedItalic = normalizeText(italicMatches.join(' '));
    if (joinedItalic !== 'Last updated: Feb 3') return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, width: 900 }}>
      <Stack gap="xs" style={{ width: 150 }}>
        <Paper p="xs" withBorder><Text size="xs" c="dimmed">Velocity</Text><Text fw={700}>32 pts</Text></Paper>
        <Paper p="xs" withBorder><Text size="xs" c="dimmed">Burndown</Text><Text fw={700} c="green">On track</Text></Paper>
        <Badge color="blue" fullWidth>Sprint 12</Badge>
        <Badge color="gray" fullWidth>Q1 2024</Badge>
        <Paper p="xs" withBorder>
          <Text size="xs" fw={500} mb={2}>Activity</Text>
          <Text size="xs" c="dimmed">PR #412 merged</Text>
          <Text size="xs" c="dimmed">Deploy v2.4.1</Text>
          <Text size="xs" c="dimmed">Issue #88 closed</Text>
        </Paper>
      </Stack>

      <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
        <Text fw={600} size="lg" mb="xs">Sprint brief</Text>
        <Text size="sm" c="dimmed" mb="sm">Make the editor match the Example card.</Text>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.BulletList />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content style={{ minHeight: 150 }} />
            </RichTextEditor>
          </div>

          <Paper p="md" withBorder style={{ width: 220, backgroundColor: 'var(--mantine-color-gray-0)' }}>
            <Text size="sm" fw={500} c="dimmed" mb="sm">Example</Text>
            <h2 style={{ textAlign: 'center', margin: '0 0 8px 0', fontSize: '1.25rem' }}>Sprint 12</h2>
            <ol style={{ margin: '0 0 8px 0', paddingLeft: '1.25rem' }}>
              <li>Fix bugs</li>
              <li>Polish UI</li>
            </ol>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem' }}>Last updated: Feb 3</p>
          </Paper>
        </div>

        <Group justify="flex-end" mt="md">
          <Button onClick={handleSave}>Save brief</Button>
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
