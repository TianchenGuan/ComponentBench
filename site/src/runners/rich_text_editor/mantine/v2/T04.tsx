'use client';

/**
 * rich_text_editor-mantine-v2-T04: Exact-span link insertion in a drawer
 *
 * Drawer flow layout. Clicking "Edit resources" opens a Drawer with an editor labeled "Resources"
 * containing "See the release notes for details." Select only "release notes" and link it to
 * https://example.com/notes. The Link control opens a popover. Then click "Save resources".
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Button, Drawer, Group, Stack, Paper, Badge } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapLink from '@tiptap/extension-link';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TipTapLink.configure({ openOnClick: false }),
    ],
    content: '<p>See the release notes for details.</p>',
  });

  const handleSave = () => {
    if (!editor || successFired.current) return;

    const plainText = editor.getText();
    if (!textsMatch(plainText, 'See the release notes for details.', { normalize: true, ignoreTrailingNewline: true })) return;

    const html = editor.getHTML();
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
    const links: { href: string; text: string }[] = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      links.push({ href: match[1], text: match[2] });
    }

    if (links.length !== 1) return;
    if (links[0].text !== 'release notes') return;
    if (links[0].href !== 'https://example.com/notes') return;

    setDrawerOpen(false);
    successFired.current = true;
    onSuccess();
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 16, padding: 16, width: 700 }}>
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ flex: 1 }}>
          <Group justify="space-between" mb="md">
            <Text fw={600} size="lg">Resources</Text>
            <Badge color="blue" variant="light">v2.4</Badge>
          </Group>
          <Text size="sm" c="dimmed" mb="md">
            Open the drawer and link "release notes" to https://example.com/notes.
          </Text>
          <Paper p="sm" withBorder mb="md">
            <Text size="sm">Current: See the release notes for details.</Text>
          </Paper>
          <Button onClick={() => setDrawerOpen(true)}>Edit resources</Button>
        </Card>

        <Stack gap="xs" style={{ width: 160 }}>
          <Paper p="sm" withBorder>
            <Text size="xs" c="dimmed">Docs updated</Text>
            <Text size="sm" fw={500}>Yesterday</Text>
          </Paper>
          <Paper p="sm" withBorder>
            <Text size="xs" c="dimmed">Links count</Text>
            <Text size="sm" fw={500}>3</Text>
          </Paper>
        </Stack>
      </div>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Edit resources"
        position="right"
        size="md"
      >
        <Stack gap="md" style={{ height: '100%' }}>
          <Text fw={500} size="sm">Resources</Text>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>

          <Group justify="flex-end" mt="auto">
            <Button variant="subtle" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save resources</Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
