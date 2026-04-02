'use client';

/**
 * textarea-mantine-T10: Clear the Spanish translation with confirmation
 *
 * A translation editor card contains three Mantine Textarea instances (instances=3):
 * - Light theme, comfortable spacing, default scale.
 * - Textareas are labeled "English", "Spanish", and "French".
 * - Initial values:
 *   - English: "Welcome!"
 *   - Spanish: "¡Bienvenido!"
 *   - French: "Bienvenue !"
 * - Under the Spanish textarea is a button "Clear Spanish…".
 * - Clicking "Clear Spanish…" opens a small confirmation modal with actions "Cancel" and destructive "Clear".
 * - Confirming "Clear" empties ONLY the Spanish textarea; the other languages remain unchanged.
 *
 * Success: Spanish value equals "" (empty) AND English/French remain unchanged. (require_confirm=true, require_correct_instance=true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Button, Modal, Group, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const INITIAL_ENGLISH = 'Welcome!';
const INITIAL_SPANISH = '¡Bienvenido!';
const INITIAL_FRENCH = 'Bienvenue !';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [english, setEnglish] = useState(INITIAL_ENGLISH);
  const [spanish, setSpanish] = useState(INITIAL_SPANISH);
  const [french, setFrench] = useState(INITIAL_FRENCH);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success: Spanish is empty AND English/French are unchanged
    if (
      spanish.trim() === '' &&
      english === INITIAL_ENGLISH &&
      french === INITIAL_FRENCH &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [spanish, english, french, onSuccess]);

  const handleClearSpanishClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmClear = () => {
    setSpanish('');
    setIsConfirmOpen(false);
  };

  const handleCancelClear = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
        <Text fw={600} size="lg" mb="md">
          Translation Editor
        </Text>

        <Stack gap="md">
          <Textarea
            label="English"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            minRows={2}
            data-testid="textarea-english"
          />

          <div>
            <Textarea
              label="Spanish"
              value={spanish}
              onChange={(e) => setSpanish(e.target.value)}
              minRows={2}
              data-testid="textarea-spanish"
            />
            <Button
              variant="subtle"
              color="red"
              size="xs"
              mt="xs"
              onClick={handleClearSpanishClick}
              data-testid="btn-clear-spanish"
            >
              Clear Spanish…
            </Button>
          </div>

          <Textarea
            label="French"
            value={french}
            onChange={(e) => setFrench(e.target.value)}
            minRows={2}
            data-testid="textarea-french"
          />
        </Stack>
      </Card>

      <Modal
        opened={isConfirmOpen}
        onClose={handleCancelClear}
        title="Confirm Clear"
        size="sm"
      >
        <Text size="sm" mb="md">
          This will clear the Spanish translation. Continue?
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancelClear}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmClear} data-testid="btn-confirm-clear">
            Clear
          </Button>
        </Group>
      </Modal>
    </>
  );
}
