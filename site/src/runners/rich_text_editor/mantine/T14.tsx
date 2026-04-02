'use client';

/**
 * rich_text_editor-mantine-T14: Drag-select and highlight a phrase
 *
 * Centered isolated card with one RichTextEditor labeled "Priority note".
 * Initial paragraph: "This is a high priority request—please respond."
 * The phrase "high priority" appears in the middle of the sentence.
 * The toolbar includes a Highlight control.
 * The intent is to select the phrase (typically via drag selection across both words) and then toggle highlight.
 *
 * Success: Plain text remains "This is a high priority request—please respond."
 * Only the substring "high priority" has the highlight mark.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const INITIAL_TEXT = 'This is a high priority request—please respond.';
const TARGET_HIGHLIGHT = 'high priority';

export default function T14({ onSuccess }: TaskComponentProps) {
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
      
      if (!textsMatch(plainText, INITIAL_TEXT, { normalize: true, ignoreTrailingNewline: true })) {
        return;
      }

      const html = editor.getHTML();
      
      // Check that "high priority" is highlighted
      const highlightRegex = /<mark[^>]*>([^<]*)<\/mark>/g;
      const highlightMatches: string[] = [];
      let match;
      while ((match = highlightRegex.exec(html)) !== null) {
        highlightMatches.push(match[1]);
      }
      
      if (highlightMatches.length === 1 && highlightMatches[0] === TARGET_HIGHLIGHT) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-priority-note">
      <Text fw={600} size="lg" mb="md">
        Priority note
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Highlight the phrase "high priority".
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
