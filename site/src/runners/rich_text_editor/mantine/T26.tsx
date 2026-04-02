'use client';

/**
 * rich_text_editor-mantine-T26: Compose in a drawer and send
 *
 * The page shows an inbox list (static rows) and a "Compose message" button.
 * Clicking it opens a drawer_flow panel sliding in from the right titled "Compose".
 * Inside the drawer is one RichTextEditor labeled "Message" (initially empty) and footer buttons
 * "Close" and "Send".
 * The message is committed only when "Send" is clicked; until then, edits are local to the drawer.
 *
 * Success: The "Compose" drawer is opened during the task.
 * After clicking "Send", the committed Message value equals "Meeting moved to 4 PM."
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Button, Drawer, Group, Stack, Paper } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const TARGET_TEXT = 'Meeting moved to 4 PM.';

export default function T26({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [committedMessage, setCommittedMessage] = useState('');
  const successFired = useRef(false);
  const drawerWasOpened = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '',
  });

  // Reset editor when drawer opens
  useEffect(() => {
    if (drawerOpen && editor) {
      drawerWasOpened.current = true;
      editor.commands.setContent('');
    }
  }, [drawerOpen, editor]);

  const handleSend = () => {
    if (!editor) return;
    
    const message = editor.getText();
    setCommittedMessage(message);
    setDrawerOpen(false);
    
    // Check success
    if (!successFired.current && drawerWasOpened.current) {
      if (textsMatch(message, TARGET_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        successFired.current = true;
        onSuccess();
      }
    }
  };

  const handleClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }} data-testid="inbox-card">
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">Inbox</Text>
          <Button onClick={() => setDrawerOpen(true)} data-testid="compose-button">
            Compose message
          </Button>
        </Group>
        
        <Text size="sm" c="dimmed" mb="md">
          Goal: Message = "Meeting moved to 4 PM." (Send)
        </Text>
        
        <Stack gap="xs">
          <Paper p="sm" withBorder>
            <Text size="sm" fw={500}>Team standup notes</Text>
            <Text size="xs" c="dimmed">From: alice@example.com</Text>
          </Paper>
          <Paper p="sm" withBorder>
            <Text size="sm" fw={500}>Q1 report ready</Text>
            <Text size="xs" c="dimmed">From: bob@example.com</Text>
          </Paper>
          <Paper p="sm" withBorder>
            <Text size="sm" fw={500}>Design review feedback</Text>
            <Text size="xs" c="dimmed">From: carol@example.com</Text>
          </Paper>
        </Stack>
        
        {committedMessage && (
          <Paper p="sm" withBorder mt="md" bg="green.0">
            <Text size="sm" fw={500}>Sent message:</Text>
            <Text size="sm">{committedMessage}</Text>
          </Paper>
        )}
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Compose"
        position="right"
        size="md"
        data-testid="compose-drawer"
      >
        <Stack gap="md" style={{ height: '100%' }}>
          <Text fw={500}>Message</Text>
          <RichTextEditor editor={editor} style={{ flex: 1 }}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="message-editor" />
          </RichTextEditor>

          <Group justify="flex-end">
            <Button variant="subtle" onClick={handleClose} data-testid="close-button">
              Close
            </Button>
            <Button onClick={handleSend} data-testid="send-button">
              Send
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
