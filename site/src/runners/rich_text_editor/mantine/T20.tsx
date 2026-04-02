'use client';

/**
 * rich_text_editor-mantine-T20: Open editor and cancel without saving
 *
 * The page shows a read-only announcement preview: "Welcome to the portal!" and a button "Edit announcement".
 * Clicking it opens a modal titled "Edit announcement" containing a RichTextEditor labeled "Announcement text"
 * pre-filled with "Welcome to the portal!".
 * The modal footer has "Cancel" and "Save" buttons. Closing via "Cancel" discards any edits and leaves
 * the saved announcement unchanged.
 * To increase realism, the editor shows a subtle "Unsaved changes" indicator only after content is modified.
 *
 * Success: The user has opened the "Edit announcement" modal at least once during the task.
 * After clicking "Cancel", the saved announcement text remains exactly "Welcome to the portal!".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Button, Modal, Group, Badge } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const INITIAL_CONTENT = 'Welcome to the portal!';

export default function T20({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [committedAnnouncement, setCommittedAnnouncement] = useState(INITIAL_CONTENT);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const successFired = useRef(false);
  const modalWasOpened = useRef(false);
  const cancelClicked = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: `<p>${INITIAL_CONTENT}</p>`,
    onUpdate: ({ editor }) => {
      const currentText = editor.getText().trim();
      setHasUnsavedChanges(currentText !== committedAnnouncement);
    },
  });

  // Reset editor content when modal opens
  useEffect(() => {
    if (modalOpen && editor) {
      modalWasOpened.current = true;
      editor.commands.setContent(`<p>${committedAnnouncement}</p>`);
      setHasUnsavedChanges(false);
    }
  }, [modalOpen, editor, committedAnnouncement]);

  // Check for success after cancel
  useEffect(() => {
    if (cancelClicked.current && modalWasOpened.current && !successFired.current) {
      if (textsMatch(committedAnnouncement, INITIAL_CONTENT, { normalize: true })) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [committedAnnouncement, onSuccess]);

  const handleSave = () => {
    if (!editor) return;
    const newText = editor.getText().trim();
    setCommittedAnnouncement(newText);
    setModalOpen(false);
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    cancelClicked.current = true;
    setModalOpen(false);
    setHasUnsavedChanges(false);
    
    // Check success immediately after cancel
    if (modalWasOpened.current && !successFired.current) {
      if (textsMatch(committedAnnouncement, INITIAL_CONTENT, { normalize: true })) {
        successFired.current = true;
        setTimeout(() => onSuccess(), 100);
      }
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-testid="announcement-card">
        <Text fw={600} size="lg" mb="md">
          Announcement
        </Text>
        <Text size="sm" c="dimmed" mb="sm">
          Goal: Cancel without changing the saved announcement
        </Text>
        <Card withBorder p="md" mb="md" data-testid="announcement-preview">
          <Text>{committedAnnouncement}</Text>
        </Card>
        <Button onClick={() => setModalOpen(true)} data-testid="edit-announcement-button">
          Edit announcement
        </Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit announcement"
        size="lg"
        data-testid="edit-announcement-modal"
      >
        <Group justify="space-between" mb="sm">
          <Text fw={500}>Announcement text</Text>
          {hasUnsavedChanges && (
            <Badge color="yellow" size="sm">Unsaved changes</Badge>
          )}
        </Group>
        
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={0}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content data-testid="announcement-editor" />
        </RichTextEditor>

        <Group justify="flex-end" mt="lg">
          <Button variant="subtle" onClick={handleCancel} data-testid="cancel-button">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="save-button">
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
}
