'use client';

/**
 * text_input-mantine-T07: Open drawer and enter internal note
 * 
 * Scene is a drawer_flow interaction anchored near the bottom-right of the viewport. The main page shows
 * a small card with a button labeled "Quick note". Clicking "Quick note" opens a Mantine Drawer sliding in
 * from the right. Inside the drawer is a single Mantine TextInput labeled "Internal note", initially empty.
 * The drawer also has a close (X) button in its header as a distractor; closing is not required for success.
 * No other text inputs are present outside or inside the drawer, and no save button is required.
 * 
 * Success: The "Quick note" drawer is open (the "Internal note" field is present in the DOM) and the TextInput
 * labeled "Internal note" has value "Escalate to tier 2" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Text, Button, Drawer } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [internalNote, setInternalNote] = useState('');

  useEffect(() => {
    if (internalNote.trim() === 'Escalate to tier 2') {
      onSuccess();
    }
  }, [internalNote, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 250 }}>
        <Text fw={600} size="lg" mb="md">Support</Text>
        <Button onClick={() => setOpened(true)} data-testid="quick-note-btn">
          Quick note
        </Button>
      </Card>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Quick note"
        position="right"
        size="sm"
      >
        <TextInput
          label="Internal note"
          placeholder="Enter note..."
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
          data-testid="internal-note-input"
        />
      </Drawer>
    </>
  );
}
