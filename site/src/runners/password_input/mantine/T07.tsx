'use client';

/**
 * password_input-mantine-T07: Enter a strong password with live strength popover
 * 
 * A centered card titled "Create password" contains a Mantine PasswordInput labeled "Your password".
 * When the input gains focus, a Popover opens beneath it showing a Progress bar (strength meter)
 * and a list of requirements (includes number, lowercase, uppercase, special symbol, and minimum length).
 * The PasswordInput starts empty and includes a visibility toggle icon. The popover can visually
 * overlap nearby elements while typing, and it closes on blur.
 * No Save button is required; success depends only on the final input value.
 * 
 * Success: The PasswordInput labeled "Your password" equals exactly "Strong#A1b2".
 */

import React, { useState, useEffect } from 'react';
import { Card, PasswordInput, Text, Progress, Popover, Box, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      size="xs"
      mt={5}
    >
      {meets ? (
        <ThemeIcon color="teal" size={14} radius="xl" style={{ marginRight: 8 }}>
          <IconCheck size={12} />
        </ThemeIcon>
      ) : (
        <ThemeIcon color="red" size={14} radius="xl" style={{ marginRight: 8 }}>
          <IconX size={12} />
        </ThemeIcon>
      )}
      {label}
    </Text>
  );
}

function getStrength(password: string) {
  let multiplier = 0;
  if (password.length >= 8) multiplier++;
  if (/[a-z]/.test(password)) multiplier++;
  if (/[A-Z]/.test(password)) multiplier++;
  if (/[0-9]/.test(password)) multiplier++;
  if (/[^a-zA-Z0-9]/.test(password)) multiplier++;
  return (multiplier / 5) * 100;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [popoverOpened, setPopoverOpened] = useState(false);
  const strength = getStrength(value);

  const requirements = [
    { re: /.{8,}/, label: 'At least 8 characters' },
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[^a-zA-Z0-9]/, label: 'Includes special symbol' },
  ];

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  useEffect(() => {
    if (value === 'Strong#A1b2') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Create password</Text>
      <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
        <Popover.Target>
          <div
            onFocusCapture={() => setPopoverOpened(true)}
            onBlurCapture={() => setPopoverOpened(false)}
          >
            <PasswordInput
              label="Your password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              data-testid="your-password-input"
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Progress color={color} value={strength} size={5} mb="xs" />
          <Text size="xs" c="dimmed" mb={5}>Password strength</Text>
          {checks}
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
