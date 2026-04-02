'use client';

/**
 * rich_text_editor-mantine-v2-T11: Subscript and superscript in the correct note
 *
 * Inline surface with two side-by-side editors: "Meeting note" and "Chemistry note".
 * In Chemistry note, text is "H2O uses m2 notation." — format the first `2` (in H2O)
 * as subscript and the second `2` (in m2) as superscript.
 * Leave Meeting note unchanged. Click "Apply note".
 */

import React, { useRef } from 'react';
import { Card, Text, Button, Group } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

export default function T11({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const meetingEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Subscript, Superscript],
    content: '<p>Agenda locked.</p>',
  });

  const chemistryEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Subscript, Superscript],
    content: '<p>H2O uses m2 notation.</p>',
  });

  const handleApply = () => {
    if (!meetingEditor || !chemistryEditor || successFired.current) return;

    // Meeting note unchanged
    if (!textsMatch(meetingEditor.getText(), 'Agenda locked.', { normalize: true, ignoreTrailingNewline: true })) return;

    // Chemistry note text preserved
    if (!textsMatch(chemistryEditor.getText(), 'H2O uses m2 notation.', { normalize: true, ignoreTrailingNewline: true })) return;

    const html = chemistryEditor.getHTML();

    // Check subscript on first 2 (H2O)
    const subMatches = html.match(/<sub>([^<]*)<\/sub>/g) || [];
    if (subMatches.length !== 1 || !/<sub>2<\/sub>/.test(html)) return;

    // Check superscript on second 2 (m2)
    const supMatches = html.match(/<sup>([^<]*)<\/sup>/g) || [];
    if (supMatches.length !== 1 || !/<sup>2<\/sup>/.test(html)) return;

    // Verify H<sub>2</sub>O comes before m<sup>2</sup>
    const subIdx = html.indexOf('<sub>2</sub>');
    const supIdx = html.indexOf('<sup>2</sup>');
    if (subIdx < 0 || supIdx < 0 || subIdx >= supIdx) return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <div style={{ padding: 16, width: 700 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={600} size="lg" mb="xs">Review card</Text>
        <Text size="sm" c="dimmed" mb="sm">
          In "Chemistry note": subscript the 2 in H2O, superscript the 2 in m2.
        </Text>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Text fw={500} size="sm" mb={4}>Meeting note</Text>
            <RichTextEditor editor={meetingEditor}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
          </div>

          <div style={{ flex: 1 }}>
            <Text fw={500} size="sm" mb={4}>Chemistry note</Text>
            <RichTextEditor editor={chemistryEditor}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
          </div>
        </div>

        <Group justify="flex-end" mt="md">
          <Button onClick={handleApply}>Apply note</Button>
        </Group>
      </Card>
    </div>
  );
}
