'use client';

/**
 * rich_text_editor-mantine-v2-T14: Two-editor drawer with exact heading-divider-list structure
 *
 * Drawer flow. Click "Open checklist drawer". Drawer has two editors: "Deployment note" (empty)
 * and "Internal note" ("Leave untouched."). In Deployment note create: H3 "Risks",
 * horizontal rule, bullet list ["API drift", "Manual rollback"]. Click "Save drawer".
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Button, Drawer, Group, Stack, Paper, Badge } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { textsMatch, normalizeText } from '../../types';

export default function T14({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successFired = useRef(false);

  const deploymentEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
  });

  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Leave untouched.</p>',
  });

  const handleSave = () => {
    if (!deploymentEditor || !internalEditor || successFired.current) return;

    // Internal note unchanged
    if (!textsMatch(internalEditor.getText(), 'Leave untouched.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Check deployment note structure
    const json = deploymentEditor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0))
    );

    if (content.length !== 3) return;

    // Block 1: H3 "Risks"
    if (content[0].type !== 'heading' || content[0].attrs?.level !== 3) return;
    if (normalizeText(getTextFromBlock(content[0])) !== 'Risks') return;

    // Block 2: horizontal rule
    if (content[1].type !== 'horizontalRule') return;

    // Block 3: bullet list
    if (content[2].type !== 'bulletList') return;
    const items = content[2].content || [];
    if (items.length !== 2) return;
    const expected = ['API drift', 'Manual rollback'];
    for (let i = 0; i < 2; i++) {
      if (items[i].type !== 'listItem') return;
      if (normalizeText(getListItemText(items[i])) !== expected[i]) return;
    }

    setDrawerOpen(false);
    successFired.current = true;
    onSuccess();
  };

  return (
    <>
      <div style={{ padding: 16, width: 600 }}>
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={600} size="lg">Deployment checklist</Text>
            <Badge color="blue" variant="light">Pre-release</Badge>
          </Group>
          <Text size="sm" c="dimmed" mb="md">
            Open the drawer and build: H3 "Risks" → horizontal rule → bullet list.
          </Text>
          <Paper p="sm" withBorder mb="md">
            <Text size="sm" c="dimmed">Current deployment notes: (none)</Text>
          </Paper>
          <Button onClick={() => setDrawerOpen(true)}>Open checklist drawer</Button>
        </Card>
      </div>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Checklist drawer"
        position="right"
        size="lg"
      >
        <Stack gap="md">
          <div>
            <Text fw={500} size="sm" mb={4}>Deployment note</Text>
            <RichTextEditor editor={deploymentEditor}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Hr />
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
              <RichTextEditor.Content style={{ minHeight: 120 }} />
            </RichTextEditor>
          </div>

          <div>
            <Text fw={500} size="sm" mb={4}>Internal note</Text>
            <RichTextEditor editor={internalEditor}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
          </div>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save drawer</Button>
          </Group>
        </Stack>
      </Drawer>
    </>
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
