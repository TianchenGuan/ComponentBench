'use client';

/**
 * rich_text_editor-mantine-T10: Edit bio in a modal and save
 *
 * The page shows a simple profile card with a button labeled "Edit bio".
 * Clicking it opens a modal_flow dialog titled "Edit bio" containing one RichTextEditor labeled "Bio".
 * The editor initially contains: "(Tell us about yourself)".
 * The modal footer has two buttons: "Cancel" and "Save changes".
 * Changes to the editor are not committed unless "Save changes" is clicked.
 * Clutter is low: profile avatar and static fields (Name/Role) are visible behind the modal but not interactive.
 *
 * Success: The "Edit bio" modal is open at some point during the interaction.
 * After clicking "Save changes", the committed Bio value equals "Loves typography." (whitespace-normalized).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Button, Modal, Group, Avatar, Stack } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const INITIAL_CONTENT = '(Tell us about yourself)';
const TARGET_TEXT = 'Loves typography.';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [committedBio, setCommittedBio] = useState(INITIAL_CONTENT);
  const successFired = useRef(false);
  const modalWasOpened = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: `<p>${INITIAL_CONTENT}</p>`,
  });

  // Reset editor content when modal opens
  useEffect(() => {
    if (modalOpen && editor) {
      modalWasOpened.current = true;
      editor.commands.setContent(`<p>${committedBio}</p>`);
    }
  }, [modalOpen, editor, committedBio]);

  const handleSaveChanges = () => {
    if (!editor) return;
    
    const newBio = editor.getText();
    setCommittedBio(newBio);
    setModalOpen(false);
    
    // Check success
    if (!successFired.current && modalWasOpened.current) {
      if (textsMatch(newBio, TARGET_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        successFired.current = true;
        onSuccess();
      }
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="profile-card">
        <Stack align="center" gap="md">
          <Avatar size={80} radius="xl" color="blue">JD</Avatar>
          <div style={{ textAlign: 'center' }}>
            <Text fw={600} size="lg">John Doe</Text>
            <Text size="sm" c="dimmed">Software Engineer</Text>
          </div>
          <div style={{ width: '100%' }}>
            <Text size="sm" fw={500} mb="xs">Bio</Text>
            <Text size="sm" c="dimmed" data-testid="bio-preview">{committedBio}</Text>
          </div>
          <Button variant="outline" onClick={() => setModalOpen(true)} data-testid="edit-bio-button">
            Edit bio
          </Button>
        </Stack>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit bio"
        size="lg"
        data-testid="edit-bio-modal"
      >
        <Text size="sm" c="dimmed" mb="sm">
          Goal: Bio = "Loves typography." (Save changes)
        </Text>
        
        <Text fw={500} mb="xs">Bio</Text>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={0}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content data-testid="bio-editor" />
        </RichTextEditor>

        <Group justify="flex-end" mt="lg">
          <Button variant="subtle" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} data-testid="save-changes-button">
            Save changes
          </Button>
        </Group>
      </Modal>
    </>
  );
}
