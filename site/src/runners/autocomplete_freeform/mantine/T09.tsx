'use client';

/**
 * autocomplete_freeform-mantine-T09: Enter a new participant in a modal and save
 *
 * setup_description:
 * The main page shows a small card titled "Meeting" with one button labeled "Add participant". Clicking it opens a Mantine Modal.
 *
 * Inside the modal, there is a Mantine Autocomplete labeled "Participant" with placeholder "Type a name". Suggestions include a few existing people (Ava Rodriguez, Emily Johnson, Mason Taylor), but the component allows free input.
 *
 * The modal footer has two buttons: "Cancel" and a primary "Save". Initial state: Participant input is empty. Distractors: a short description text and an avatar placeholder are visible but not interactive.
 *
 * Feedback: typing shows the value in the input immediately, but the selection is considered committed only after clicking "Save".
 *
 * Success: The Participant Autocomplete input value equals "Zara Patel" (trim whitespace). Case-sensitive. The modal "Save" button has been pressed to confirm/commit.
 */

import React, { useState, useRef } from 'react';
import { Card, Text, Button, Modal, Autocomplete, Group, Stack, Avatar } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const participants = ['Ava Rodriguez', 'Emily Johnson', 'Mason Taylor'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participantValue, setParticipantValue] = useState('');
  const successFired = useRef(false);

  const handleSave = () => {
    const normalizedValue = participantValue.trim();
    const targetValue = 'Zara Patel';
    
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      setIsModalOpen(false);
      onSuccess();
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }}>
        <Text fw={600} size="lg" mb="md">Meeting</Text>
        <Button onClick={() => setIsModalOpen(true)}>Add participant</Button>
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add participant"
        centered
      >
        <Stack>
          <Group>
            <Avatar size="lg" radius="xl" />
            <Text size="sm" c="dimmed">Add a new participant to the meeting.</Text>
          </Group>
          
          <div>
            <Text fw={500} size="sm" mb={8}>Participant</Text>
            <Autocomplete
              data-testid="participant"
              placeholder="Type a name"
              data={participants}
              value={participantValue}
              onChange={setParticipantValue}
            />
          </div>
          
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setIsModalOpen(false)} data-testid="participant-cancel">
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="participant-save">
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
