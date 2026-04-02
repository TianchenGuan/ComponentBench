'use client';

/**
 * code_editor-mantine-T08: Discard changes in drawer (2 editors)
 *
 * Dark-themed settings page with a drawer already open on the right (drawer_flow).
 * Inside the drawer are two code editor instances:
 *   • "Nginx config" (Monaco)
 *   • "Notes" (plain text editor, also CodeMirror-based)
 * Only the Nginx config editor matters for this task.
 * Initial state: the Nginx config editor shows an UNSAVED modified version (server_name is `temp.local`).
 * There is a Close (X) icon in the drawer header. Clicking it opens a confirmation dialog
 * "Discard unsaved changes?" with buttons "Discard" and "Keep editing".
 * Choosing Discard closes the drawer and restores the Nginx editor content back to the saved version
 * (server_name `localhost`).
 *
 * Success: The Nginx config editor content equals the saved version (server_name `localhost`).
 * The drawer is closed (not visible).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Text, Button, Group, Drawer, Modal, Box, ActionIcon, MantineProvider } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import Editor from '@monaco-editor/react';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const SAVED_CONTENT = `server {
  listen 80;
  server_name localhost;
}`;

const MODIFIED_CONTENT = `server {
  listen 80;
  server_name temp.local;
}`;

export default function T08({ onSuccess }: TaskComponentProps) {
  const notesEditorRef = useRef<HTMLDivElement>(null);
  const notesViewRef = useRef<EditorView | null>(null);
  
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [nginxContent, setNginxContent] = useState(MODIFIED_CONTENT);
  const successFired = useRef(false);

  // Initialize Notes CodeMirror
  useEffect(() => {
    if (!notesEditorRef.current || notesViewRef.current) return;

    const state = EditorState.create({
      doc: '// Notes here',
      extensions: [basicSetup, keymap.of([indentWithTab])],
    });

    notesViewRef.current = new EditorView({
      state,
      parent: notesEditorRef.current,
    });

    return () => {
      notesViewRef.current?.destroy();
      notesViewRef.current = null;
    };
  }, [drawerOpen]);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (!drawerOpen && contentMatches(nginxContent, SAVED_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [drawerOpen, nginxContent, onSuccess]);

  const handleCloseAttempt = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleDiscard = useCallback(() => {
    setNginxContent(SAVED_CONTENT);
    setConfirmOpen(false);
    setDrawerOpen(false);
  }, []);

  const handleKeepEditing = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  return (
    <MantineProvider forceColorScheme="dark">
      <Box style={{ 
        width: '100%', 
        minHeight: 400, 
        background: '#1a1b1e',
        padding: 24,
        position: 'relative',
      }}>
        <Text fw={700} size="xl" c="white" mb="md">Settings</Text>
        <Text c="dimmed">Configure your application settings</Text>

        <Drawer
          opened={drawerOpen}
          onClose={handleCloseAttempt}
          position="right"
          size="lg"
          withCloseButton={false}
          styles={{
            body: { background: '#25262b', height: '100%' },
            header: { background: '#25262b' },
          }}
        >
          <Group justify="space-between" mb="md">
            <Text fw={600} c="white">Configuration</Text>
            <ActionIcon variant="subtle" onClick={handleCloseAttempt} data-testid="drawer-close">
              <IconX size={18} />
            </ActionIcon>
          </Group>

          {/* Nginx Config Editor - Target */}
          <Paper p="md" mb="md" style={{ background: '#2c2e33' }} data-testid="editor-nginx">
            <Text fw={500} size="sm" c="white" mb="sm">Nginx config</Text>
            <div style={{ border: '1px solid #373a40', borderRadius: 4 }}>
              <Editor
                height="150px"
                language="nginx"
                value={nginxContent}
                onChange={(v) => setNginxContent(v || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                }}
              />
            </div>
            <Text size="xs" c="orange" mt="xs">Unsaved changes</Text>
          </Paper>

          {/* Notes Editor - Distractor */}
          <Paper p="md" style={{ background: '#2c2e33' }} data-testid="editor-notes">
            <Text fw={500} size="sm" c="white" mb="sm">Notes</Text>
            <div 
              ref={notesEditorRef}
              style={{ 
                border: '1px solid #373a40', 
                borderRadius: 4,
                minHeight: 100,
              }}
            />
          </Paper>
        </Drawer>

        {/* Confirmation Modal */}
        <Modal
          opened={confirmOpen}
          onClose={handleKeepEditing}
          title="Discard unsaved changes?"
          centered
        >
          <Text size="sm" c="dimmed" mb="lg">
            You have unsaved changes. Are you sure you want to discard them?
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={handleKeepEditing}>Keep editing</Button>
            <Button color="red" onClick={handleDiscard} data-testid="discard-confirm">
              Discard
            </Button>
          </Group>
        </Modal>
      </Box>
    </MantineProvider>
  );
}
