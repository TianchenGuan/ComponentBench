'use client';

/**
 * rich_text_editor-mantine-T12: Type into the correct editor (2 instances)
 *
 * Centered isolated card shows a support ticket summary with two RichTextEditor instances stacked vertically.
 * The first editor is labeled "Customer reply" and starts empty.
 * The second editor is labeled "Internal note" and contains pre-filled text: "Remember to tag billing."
 * Both editors have identical toolbars and look similar, so the label is the main disambiguation cue.
 * No Save button; edits apply immediately.
 *
 * Success: The "Customer reply" editor plain text equals "Thanks for the report—we're on it."
 * The "Internal note" editor remains unchanged (still contains "Remember to tag billing.").
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch, normalizeText } from '../types';

const TARGET_CUSTOMER_REPLY = 'Thanks for the report—we\'re on it.';
const INITIAL_INTERNAL_NOTE = 'Remember to tag billing.';

export default function T12({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const customerEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '',
  });

  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: `<p>${INITIAL_INTERNAL_NOTE}</p>`,
  });

  useEffect(() => {
    if (!customerEditor || !internalEditor || successFired.current) return;

    const checkSuccess = () => {
      let customerText = customerEditor.getText().replace(/\n+$/, '').trim();
      const internalText = internalEditor.getText();

      // Strip surrounding quotes if user added them
      customerText = customerText.replace(/^[""\u201C\u201D]+|[""\u201C\u201D]+$/g, '').trim();

      // Normalize dashes: em dash, en dash, double hyphen → em dash
      const normalizeDashes = (s: string) => s.replace(/\u2014|\u2013|--/g, '\u2014');
      // Normalize apostrophes: curly → straight
      const normalizeApostrophes = (s: string) => s.replace(/[\u2018\u2019]/g, "'");

      const normCustomer = normalizeApostrophes(normalizeDashes(normalizeText(customerText)));
      const normTarget = normalizeApostrophes(normalizeDashes(normalizeText(TARGET_CUSTOMER_REPLY)));

      const customerMatch = normCustomer === normTarget;
      const internalMatch = textsMatch(internalText, INITIAL_INTERNAL_NOTE, { normalize: true, ignoreTrailingNewline: true });
      
      if (customerMatch && internalMatch) {
        successFired.current = true;
        onSuccess();
      }
    };

    customerEditor.on('update', checkSuccess);
    internalEditor.on('update', checkSuccess);
    
    return () => {
      customerEditor.off('update', checkSuccess);
      internalEditor.off('update', checkSuccess);
    };
  }, [customerEditor, internalEditor, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }} data-testid="ticket-card">
      <Text fw={600} size="lg" mb="md">
        Ticket
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Target: Customer reply = "Thanks for the report—we're on it."
      </Text>
      
      <Stack gap="lg">
        <div data-testid="customer-reply-section">
          <Text fw={500} mb="xs">Customer reply (rich text)</Text>
          <RichTextEditor editor={customerEditor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="customer-reply-editor" />
          </RichTextEditor>
        </div>

        <div data-testid="internal-note-section">
          <Text fw={500} mb="xs">Internal note (rich text)</Text>
          <RichTextEditor editor={internalEditor}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="internal-note-editor" />
          </RichTextEditor>
        </div>
      </Stack>
    </Card>
  );
}
