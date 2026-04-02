'use client';

/**
 * rich_text_editor-mantine-T01: Write a short status update
 *
 * Scene is an isolated card centered on the page. Inside the card is a single Mantine RichTextEditor
 * with a standard toolbar (Bold/Italic/etc.) above an empty editing area.
 * The editor label above the toolbar reads "Status update". The editor is focused only when clicked
 * inside the content area; there is no Save/Apply button and changes are immediate.
 * No other interactive controls are present.
 *
 * Success: The RichTextEditor instance labeled "Status update" has plain text exactly equal to
 * "We shipped the February build." after whitespace normalization.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const TARGET_TEXT = 'We shipped the February build.';

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const plainText = editor.getText();
      if (textsMatch(plainText, TARGET_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        successFired.current = true;
        onSuccess();
      }
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-status-update">
      <Text fw={600} size="lg" mb="md">
        Status update
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Please enter: We shipped the February build.
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Card>
  );
}
