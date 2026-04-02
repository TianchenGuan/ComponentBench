'use client';

/**
 * rich_text_editor-mantine-T11: Apply two different inline formats
 *
 * Baseline centered card with one RichTextEditor labeled "Reminder".
 * Initial content is one paragraph: "Please review the Q1 plan today."
 * The toolbar includes Highlight and Italic controls.
 * Highlight toggles a background mark on the selected text.
 * No confirmation is required.
 *
 * Success: Plain text remains "Please review the Q1 plan today."
 * Substring "Q1" has the highlight mark.
 * Substring "today" has the italic mark.
 * No other characters are highlighted or italicized.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const INITIAL_TEXT = 'Please review the Q1 plan today.';

export default function T11({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link, Highlight],
    content: `<p>${INITIAL_TEXT}</p>`,
  });

  useEffect(() => {
    if (!editor || successFired.current) return;

    const checkSuccess = () => {
      const plainText = editor.getText();
      
      // Check plain text matches
      if (!textsMatch(plainText, INITIAL_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        return;
      }

      const html = editor.getHTML();
      
      // Check Q1 is highlighted
      const highlightRegex = /<mark[^>]*>([^<]*)<\/mark>/g;
      const highlightMatches: string[] = [];
      let match;
      while ((match = highlightRegex.exec(html)) !== null) {
        highlightMatches.push(match[1]);
      }
      if (highlightMatches.length !== 1 || highlightMatches[0] !== 'Q1') return;
      
      // Check "today" is italic
      const italicRegex = /<em>([^<]*)<\/em>/g;
      const italicMatches: string[] = [];
      while ((match = italicRegex.exec(html)) !== null) {
        italicMatches.push(match[1]);
      }
      if (italicMatches.length !== 1 || italicMatches[0] !== 'today') return;
      
      successFired.current = true;
      onSuccess();
    };

    editor.on('update', checkSuccess);
    return () => {
      editor.off('update', checkSuccess);
    };
  }, [editor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-reminder">
      <Text fw={600} size="lg" mb="md">
        Reminder
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Highlight "Q1" and italicize "today".
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Highlight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Card>
  );
}
