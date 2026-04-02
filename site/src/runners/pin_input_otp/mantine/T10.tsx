'use client';

/**
 * pin_input_otp-mantine-T30: Modal: choose New device code (length 8) and Verify
 * 
 * A page with a single primary button "Add new device". Clicking it opens a Mantine
 * Modal titled "Device verification". Inside the modal are two PinInputs: "New device
 * code" (length=8, numeric) and "Admin override" (length=6, numeric). A small
 * non-interactive "Code preview" panel at the top shows the target code. The modal
 * footer contains "Cancel" and "Verify" buttons; Verify is disabled until New device
 * code has all 8 digits filled.
 * Initial state before opening: modal closed. After opening: both PinInputs empty.
 * 
 * Success: OTP value equals '78120456' in "New device code" AND Verify clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Text, PinInput, Group, Stack, Paper, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newDeviceCode, setNewDeviceCode] = useState('');
  const [adminOverride, setAdminOverride] = useState('');
  const successCalledRef = useRef(false);
  const targetCode = '78120456';

  const isComplete = newDeviceCode.length === 8;

  const handleVerify = () => {
    if (newDeviceCode === targetCode && !successCalledRef.current) {
      successCalledRef.current = true;
      setModalOpen(false);
      onSuccess();
    }
  };

  useEffect(() => {
    successCalledRef.current = false;
  }, []);

  return (
    <>
      <Button
        size="lg"
        onClick={() => {
          setNewDeviceCode('');
          setAdminOverride('');
          setModalOpen(true);
        }}
        data-testid="add-device-button"
      >
        Add new device
      </Button>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Device verification"
        size="md"
      >
        <Stack gap="lg">
          {/* Code preview */}
          <Paper p="sm" radius="md" bg="gray.1" data-testid="code-preview">
            <Text size="xs" c="dimmed" mb={4}>Code preview</Text>
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              {targetCode}
            </Text>
          </Paper>

          {/* New device code */}
          <Box aria-labelledby="new-device-label">
            <Text id="new-device-label" fw={500} size="sm" mb="xs">New device code</Text>
            <Group data-testid="otp-new-device-code" aria-label="New device code">
              <PinInput
                length={8}
                type="number"
                value={newDeviceCode}
                onChange={setNewDeviceCode}
              />
            </Group>
          </Box>

          {/* Admin override */}
          <Box aria-labelledby="admin-override-label">
            <Text id="admin-override-label" fw={500} size="sm" mb="xs">Admin override</Text>
            <Group data-testid="otp-admin-override" aria-label="Admin override">
              <PinInput
                length={6}
                type="number"
                value={adminOverride}
                onChange={setAdminOverride}
              />
            </Group>
          </Box>

          {/* Footer buttons */}
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!isComplete}
              onClick={handleVerify}
              data-testid="verify-button"
            >
              Verify
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
