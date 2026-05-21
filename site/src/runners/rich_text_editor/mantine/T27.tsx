'use client';

/**
 * rich_text_editor-mantine-T27: Publish from a modal with a confirmation step (dark)
 *
 * Dark-themed page with a post preview and a button "Edit post".
 * Clicking it opens a modal titled "Edit post" containing a RichTextEditor labeled "Post body",
 * initially pre-filled with "Draft content".
 * The modal footer has "Cancel" and "Publish". Clicking "Publish" opens a second confirmation modal
 * (stacked overlay) asking "Publish this post?" with buttons "Back" and "Confirm publish".
 * The post body is committed only after "Confirm publish" is clicked.
 *
 * Success: The "Edit post" modal is opened.
 * The "Post body" editor content is set to "Launch is live."
 * The agent clicks "Publish" and then clicks "Confirm publish".
 * After confirmation, the committed post body equals "Launch is live."
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Button, Modal, Group, Stack } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const INITIAL_CONTENT = 'Draft content';
const TARGET_TEXT = 'Launch is live.';

export default function T27({ onSuccess }: TaskComponentProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [committedPost, setCommittedPost] = useState(INITIAL_CONTENT);
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: `<p>${INITIAL_CONTENT}</p>`,
  });

  // Reset editor when modal opens
  useEffect(() => {
    if (editModalOpen && editor) {
      editor.commands.setContent(`<p>${committedPost}</p>`);
    }
  }, [editModalOpen, editor, committedPost]);

  const handlePublishClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmPublish = () => {
    if (!editor) return;
    
    const postBody = editor.getText();
    setCommittedPost(postBody);
    setConfirmModalOpen(false);
    setEditModalOpen(false);
    
    // Check success
    if (!successFired.current) {
      if (textsMatch(postBody, TARGET_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        successFired.current = true;
        onSuccess();
      }
    }
  };

  const handleBack = () => {
    setConfirmModalOpen(false);
  };

  const handleCancel = () => {
    setEditModalOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-testid="posts-card">
        <Text fw={600} size="lg" mb="md">
          Posts (dark)
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          Goal: Post body = "Launch is live." (Publish → Confirm publish)
        </Text>
        
        <Card withBorder p="md" mb="md">
          <Text size="sm" fw={500} mb="xs">Current post:</Text>
          <Text size="sm">{committedPost}</Text>
        </Card>
        
        <Button onClick={() => setEditModalOpen(true)} data-testid="edit-post-button">
          Edit post
        </Button>
      </Card>

      {/* Edit Post Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit post"
        size="lg"
        data-testid="edit-post-modal"
      >
        <Stack gap="md">
          <Text fw={500}>Post body</Text>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="post-body-editor" />
          </RichTextEditor>

          <Group justify="flex-end">
            <Button variant="subtle" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handlePublishClick} data-testid="publish-button">
              Publish
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Publish this post?"
        size="sm"
        data-testid="confirm-modal"
      >
        <Text size="sm" mb="lg">
          Are you sure you want to publish this post? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={handleBack} data-testid="back-button">
            Back
          </Button>
          <Button color="green" onClick={handleConfirmPublish} data-testid="confirm-publish-button">
            Confirm publish
          </Button>
        </Group>
      </Modal>
    </>
  );
}
