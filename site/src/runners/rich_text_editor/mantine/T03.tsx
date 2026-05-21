'use client';

/**
 * rich_text_editor-mantine-T03: Bold a single word
 *
 * Isolated card at center. One RichTextEditor labeled "Team message".
 * The editor starts with one paragraph: "Lunch is at noon".
 * The toolbar is visible with a Bold control (B icon / aria-label "Bold").
 * No Save button; formatting updates immediately.
 *
 * Success: In "Team message", the plain text remains exactly "Lunch is at noon".
 * Only the substring "noon" is marked bold; no other characters have the bold mark.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

const INITIAL_TEXT = 'Lunch is at noon';
const TARGET_BOLD_TEXT = 'noon';

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
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

      // Check HTML for bold formatting on "noon" only
      const html = editor.getHTML();
      
      // Check that "noon" is wrapped in <strong> tags
      const hasBoldNoon = /<strong>noon<\/strong>/.test(html) || 
                          /<b>noon<\/b>/.test(html);
      
      // Check that no other text is bold
      const boldMatches = html.match(/<strong>[^<]+<\/strong>|<b>[^<]+<\/b>/g) || [];
      const onlyNoonBold = boldMatches.length === 1 && 
                           (boldMatches[0] === '<strong>noon</strong>' || boldMatches[0] === '<b>noon</b>');

      if (hasBoldNoon && onlyNoonBold) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="rte-team-message">
      <Text fw={600} size="lg" mb="md">
        Team message
      </Text>
      <Text size="sm" c="dimmed" mb="sm">
        Make "noon" bold.
      </Text>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </Card>
  );
}
