'use client';

/**
 * rating-mantine-T06: Modal flow: set rating to 5 and submit (Mantine)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: modal_flow.
 * The main page shows a webinar summary with a button labeled "Rate the session".
 * Clicking it opens a modal dialog.
 * Inside the modal:
 *   • A short line: "Please rate the session".
 *   • One Mantine Rating component labeled "Overall session" (count=5, fractions=1).
 *   • Two action buttons: "Close" and "Submit".
 * Initial state: modal closed; when opened, Overall session starts at 0 (empty).
 * Success requires selecting 5 and then clicking "Submit" to confirm.
 * 
 * Success: Target rating value equals 5 out of 5 AND "Submit" is clicked.
 */

import React, { useState } from 'react';
import { Card, Text, Rating, Stack, Button, Modal, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [ratingValue, setRatingValue] = useState<number>(0);

  const handleOpen = () => {
    setRatingValue(0); // Reset rating when opening
    open();
  };

  const handleSubmit = () => {
    if (ratingValue === 5) {
      close();
      onSuccess();
    } else {
      close();
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Stack gap="md">
          <Text fw={600} size="lg">Webinar page</Text>
          <Text size="sm" c="dimmed">
            Thank you for attending today&apos;s session! Your feedback helps us improve.
          </Text>
          <Button onClick={handleOpen}>Rate the session</Button>
        </Stack>
      </Card>

      <Modal opened={opened} onClose={close} title="Rate the session">
        <Stack gap="md">
          <Text size="sm">Please rate the session</Text>
          
          <div>
            <Text fw={500} mb={8}>Overall session</Text>
            <Rating
              value={ratingValue}
              onChange={setRatingValue}
              fractions={1}
              data-testid="rating-overall-session"
            />
          </div>
          
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Close</Button>
            <Button onClick={handleSubmit} data-testid="submit-button" data-submitted={ratingValue === 5}>
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
