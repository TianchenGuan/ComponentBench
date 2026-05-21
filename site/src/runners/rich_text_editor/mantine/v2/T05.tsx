'use client';

/**
 * rich_text_editor-mantine-v2-T05: Row-local clear formatting in the correct table row
 *
 * Table layout with two rows: "Gateway" and "Billing". Each has a compact editor and a row-local Save.
 * Gateway starts with `Deploy now.` where `Deploy` is bold and `now` is italic.
 * Clear all formatting in Gateway, keep Billing unchanged, click Save in the Gateway row.
 */

import React, { useRef, useState } from 'react';
import { Card, Text, Button, Group, Table, Badge } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const gatewayEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Highlight],
    content: '<p><strong>Deploy</strong> <em>now</em>.</p>',
  });

  const billingEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Highlight],
    content: '<p>Hold release.</p>',
  });

  const handleSaveGateway = () => {
    if (!gatewayEditor || !billingEditor || successFired.current) return;

    const gatewayText = gatewayEditor.getText();
    if (!textsMatch(gatewayText, 'Deploy now.', { normalize: true, ignoreTrailingNewline: true })) return;

    const billingText = billingEditor.getText();
    if (!textsMatch(billingText, 'Hold release.', { normalize: true, ignoreTrailingNewline: true })) return;

    const html = gatewayEditor.getHTML();
    const hasFormatting = /<(strong|b|em|i|u|s|strike|del|mark|code)>/i.test(html);
    const hasLink = /<a\s/i.test(html);

    if (!hasFormatting && !hasLink) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 16, width: 700 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">Service runbooks</Text>
          <Badge color="gray" variant="light">2 services</Badge>
        </Group>
        <Text size="sm" c="dimmed" mb="sm">
          Clear formatting in Gateway row only. Keep Billing unchanged.
        </Text>

        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 100 }}>Service</Table.Th>
              <Table.Th>Runbook reply</Table.Th>
              <Table.Th style={{ width: 80 }}>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td><Text fw={500} size="sm">Gateway</Text></Table.Td>
              <Table.Td>
                <RichTextEditor editor={gatewayEditor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={0}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.ClearFormatting />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>
                  <RichTextEditor.Content />
                </RichTextEditor>
              </Table.Td>
              <Table.Td>
                <Button size="xs" onClick={handleSaveGateway} data-testid="save-gateway-row">Save</Button>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td><Text fw={500} size="sm">Billing</Text></Table.Td>
              <Table.Td>
                <RichTextEditor editor={billingEditor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={0}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.ClearFormatting />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>
                  <RichTextEditor.Content />
                </RichTextEditor>
              </Table.Td>
              <Table.Td>
                <Button size="xs" variant="light" disabled>Save</Button>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}
