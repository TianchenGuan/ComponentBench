'use client';

/**
 * masked_input-mantine-v2-T03: IBAN in modal with card-level apply
 *
 * A dark-themed page with a button "Add bank account" that opens a Mantine Modal.
 * The modal contains one masked TextInput "IBAN (DE)" with pattern DE## #### #### #### #### ##,
 * a read-only "Account holder" field, and a modal-level "Apply account" button.
 * The field starts empty; closing the modal without applying discards the draft.
 *
 * Success: committed IBAN equals "DE89 3704 0044 0532 0130 00" AND modal is closed
 * AND Apply account was clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Text, TextInput, Group, Box, MantineProvider } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState('');
  const [committed, setCommitted] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && !opened && committed === 'DE89 3704 0044 0532 0130 00') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, opened, committed, onSuccess]);

  const handleApply = () => {
    setCommitted(draft);
    setApplied(true);
    setOpened(false);
  };

  const handleClose = () => {
    setDraft(committed);
    setOpened(false);
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box p="xl" style={{ minHeight: '100vh', background: '#1a1b1e' }}>
        <Button onClick={() => setOpened(true)}>Add bank account</Button>

        <Modal
          opened={opened}
          onClose={handleClose}
          title="Add bank account"
          centered
          size="md"
        >
          <Text fw={500} size="sm" mb={4}>IBAN (DE)</Text>
          <IMaskInput
            mask="DE00 0000 0000 0000 0000 00"
            definitions={{ '0': /[0-9]/ }}
            placeholder="DE## #### #### #### #### ##"
            value={draft}
            onAccept={(val: string) => setDraft(val)}
            data-testid="iban-de"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '1px solid #373a40',
              borderRadius: 4,
              outline: 'none',
              background: '#25262b',
              color: '#c1c2c5',
            }}
          />

          <TextInput
            label="Account holder"
            value="Max Mustermann"
            readOnly
            mt="md"
            styles={{ input: { cursor: 'default' } }}
          />

          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleApply}>Apply account</Button>
          </Group>
        </Modal>
      </Box>
    </MantineProvider>
  );
}
