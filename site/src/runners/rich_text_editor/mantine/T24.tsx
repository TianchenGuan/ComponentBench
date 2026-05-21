'use client';

/**
 * rich_text_editor-mantine-T24: Disambiguate 3 small editors and apply strikethrough
 *
 * Centered isolated card with three RichTextEditor instances arranged in a row (compact column layout).
 * Each uses the subtle variant toolbar and the overall scale is small.
 * Labels above each editor:
 * - "Public note" (pre-filled: "No breaking changes.")
 * - "Partner note" (pre-filled: "This endpoint is deprecated.")
 * - "Internal note" (pre-filled: "Follow up with migration guide.")
 * Aside from these three editors, there are no additional interactive controls on the card.
 *
 * Success: Public note remains "No breaking changes."
 * Internal note remains "Follow up with migration guide."
 * Partner note plain text remains "This endpoint is deprecated." and only "deprecated" is strikethrough.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, SimpleGrid } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../types';
import { textsMatch } from '../types';

export default function T24({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const publicEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>No breaking changes.</p>',
  });

  const partnerEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>This endpoint is deprecated.</p>',
  });

  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: '<p>Follow up with migration guide.</p>',
  });

  useEffect(() => {
    if (!publicEditor || !partnerEditor || !internalEditor || successFired.current) return;

    const checkSuccess = () => {
      // Check public note unchanged
      const publicText = publicEditor.getText();
      if (!textsMatch(publicText, 'No breaking changes.', { normalize: true, ignoreTrailingNewline: true })) return;
      
      // Check internal note unchanged
      const internalText = internalEditor.getText();
      if (!textsMatch(internalText, 'Follow up with migration guide.', { normalize: true, ignoreTrailingNewline: true })) return;
      
      // Check partner note text unchanged
      const partnerText = partnerEditor.getText();
      if (!textsMatch(partnerText, 'This endpoint is deprecated.', { normalize: true, ignoreTrailingNewline: true })) return;
      
      // Check "deprecated" is strikethrough
      const html = partnerEditor.getHTML();
      const strikeRegex = /<s>([^<]*)<\/s>|<strike>([^<]*)<\/strike>|<del>([^<]*)<\/del>/g;
      const strikeMatches: string[] = [];
      let match;
      while ((match = strikeRegex.exec(html)) !== null) {
        strikeMatches.push(match[1] || match[2] || match[3]);
      }
      
      if (strikeMatches.length === 1 && strikeMatches[0] === 'deprecated') {
        successFired.current = true;
        onSuccess();
      }
    };

    publicEditor.on('update', checkSuccess);
    partnerEditor.on('update', checkSuccess);
    internalEditor.on('update', checkSuccess);
    
    return () => {
      publicEditor.off('update', checkSuccess);
      partnerEditor.off('update', checkSuccess);
      internalEditor.off('update', checkSuccess);
    };
  }, [publicEditor, partnerEditor, internalEditor, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 750 }} data-testid="notes-card">
      <Text fw={600} size="lg" mb="md">
        Notes
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Strike through "deprecated" in Partner note
      </Text>
      
      <SimpleGrid cols={3} spacing="sm">
        <div data-testid="public-note-section">
          <Text size="sm" fw={500} mb="xs">Public note</Text>
          <RichTextEditor editor={publicEditor} styles={{ root: { fontSize: '0.8rem' } }}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Strikethrough />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
        </div>

        <div data-testid="partner-note-section">
          <Text size="sm" fw={500} mb="xs">Partner note</Text>
          <RichTextEditor editor={partnerEditor} styles={{ root: { fontSize: '0.8rem' } }}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Strikethrough />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content data-testid="partner-note-editor" />
          </RichTextEditor>
        </div>

        <div data-testid="internal-note-section">
          <Text size="sm" fw={500} mb="xs">Internal note</Text>
          <RichTextEditor editor={internalEditor} styles={{ root: { fontSize: '0.8rem' } }}>
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Strikethrough />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>
        </div>
      </SimpleGrid>
    </Card>
  );
}
