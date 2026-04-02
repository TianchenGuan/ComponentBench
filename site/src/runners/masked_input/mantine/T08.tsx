'use client';

/**
 * masked_input-mantine-T08: Apply IBAN in modal with inline confirm
 * 
 * Modal flow: the page contains a single button labeled "Add bank account".
 * Clicking it opens a Mantine Modal dialog with one masked TextInput labeled "IBAN (DE)".
 * The IBAN mask enforces the "DE" prefix and groups remaining characters with spaces (e.g., "DE89 3704 0044 0532 0130 00").
 * Inside the input's right section are two small icon buttons with aria-labels "Apply" and "Cancel".
 * The field starts empty and shows helper text "Not applied" until Apply is pressed; Apply commits the value (sets a committed flag) without requiring any external Save button.
 * 
 * Success: The "IBAN (DE)" masked input value equals "DE89 3704 0044 0532 0130 00" AND committed by clicking Apply.
 */

import React, { useState, useEffect } from 'react';
import { Button, Modal, Text, ActionIcon, Group } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [committedValue, setCommittedValue] = useState('');
  const [isCommitted, setIsCommitted] = useState(false);

  useEffect(() => {
    if (isCommitted && committedValue === 'DE89 3704 0044 0532 0130 00') {
      onSuccess();
    }
  }, [isCommitted, committedValue, onSuccess]);

  const handleApply = () => {
    if (value.length === 27) { // Full IBAN length with spaces
      setCommittedValue(value);
      setIsCommitted(true);
    }
  };

  const handleCancel = () => {
    setValue(committedValue);
    setIsCommitted(committedValue !== '');
  };

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => setIsOpen(true)}>
        Add bank account
      </Button>
      
      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add bank account"
        size="md"
      >
        <div style={{ marginBottom: 8 }}>
          <Text component="label" htmlFor="iban-field" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            IBAN (DE)
          </Text>
          <div style={{ position: 'relative' }}>
            <IMaskInput
              id="iban-field"
              mask="aa00 0000 0000 0000 0000 00"
              definitions={{
                'a': /[A-Za-z]/,
                '0': /[0-9]/
              }}
              prepare={(str: string) => str.toUpperCase()}
              placeholder="DE__ ____ ____ ____ ____ __"
              value={value}
              onAccept={(val: string) => setValue(val)}
              data-testid="iban-field"
              data-committed={isCommitted}
              style={{
                width: '100%',
                padding: '8px 72px 8px 12px',
                fontSize: 14,
                lineHeight: 1.55,
                border: '1px solid #ced4da',
                borderRadius: 4,
                outline: 'none',
                fontFamily: 'monospace',
              }}
            />
            <Group 
              gap={4}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <ActionIcon
                variant="light"
                color="green"
                size="sm"
                aria-label="Apply"
                onClick={handleApply}
              >
                <IconCheck size={14} />
              </ActionIcon>
              <ActionIcon
                variant="light"
                color="red"
                size="sm"
                aria-label="Cancel"
                onClick={handleCancel}
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          </div>
          <Text 
            size="xs" 
            c={isCommitted ? 'green' : 'dimmed'} 
            mt={4}
            data-testid="iban-status"
          >
            {isCommitted ? 'Applied' : 'Not applied'}
          </Text>
        </div>
      </Modal>
    </div>
  );
}
