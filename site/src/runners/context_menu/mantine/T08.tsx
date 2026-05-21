'use client';

/**
 * context_menu-mantine-T08: Cancel Revoke token confirmation
 *
 * Scene: theme=dark, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, clutter=low.
 *
 * Target element: a row labeled "API token A1B2" with a masked value.
 * Right-clicking the row opens a custom context menu.
 *
 * Context menu: composed from Mantine Menu and positioned via onContextMenu.
 *
 * Menu items:
 * - Copy token ID
 * - Revoke token… (requires confirmation)
 *
 * Confirmation behavior: selecting "Revoke token…" keeps the menu open and reveals an
 * inline confirmation footer with two buttons: "Cancel" and "Revoke".
 *
 * Goal: cancel the revocation (click Cancel).
 *
 * Success: The pending action ['Revoke token'] is cancelled via the 'Cancel' control.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Group, Box, Button } from '@mantine/core';
import { IconKey, IconAlertTriangle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<'confirmed' | 'cancelled' | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);
  const showConfirmRef = React.useRef(false);

  useEffect(() => {
    if (confirmationResult === 'cancelled' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [confirmationResult, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(true);
    setShowConfirm(false);
    showConfirmRef.current = false;
  };

  const handleRevokeClick = () => {
    showConfirmRef.current = true;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    showConfirmRef.current = false;
    setConfirmationResult('confirmed');
    setMenuOpen(false);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    showConfirmRef.current = false;
    setConfirmationResult('cancelled');
    setMenuOpen(false);
    setShowConfirm(false);
  };

  return (
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      style={{
        width: 400,
        background: 'var(--mantine-color-dark-7)',
        color: 'var(--mantine-color-gray-0)',
      }}
    >
      <Text size="lg" fw={500} mb="md">API Tokens</Text>
      
      <Menu
        opened={menuOpen}
        onChange={(open) => {
          if (!open && showConfirmRef.current) {
            return;
          }
          setMenuOpen(open);
        }}
        position="bottom-start"
      >
        <Menu.Target>
          <Group
            onContextMenu={handleContextMenu}
            gap="sm"
            p="md"
            style={{
              background: 'var(--mantine-color-dark-6)',
              borderRadius: 8,
              cursor: 'context-menu',
            }}
            data-testid="token-row"
            data-confirmation-result={confirmationResult}
          >
            <IconKey size={24} color="var(--mantine-color-blue-4)" />
            <Box style={{ flex: 1 }}>
              <Text size="sm" fw={500}>API token A1B2</Text>
              <Text size="xs" c="dimmed">••••••••••••3f7a</Text>
            </Box>
            <Text size="xs" c="dimmed">Created 7 days ago</Text>
          </Group>
        </Menu.Target>

        <Menu.Dropdown 
          style={{ background: 'var(--mantine-color-dark-6)' }}
          data-testid="context-menu-overlay"
        >
          <Menu.Item onClick={() => setMenuOpen(false)} disabled={showConfirm}>
            Copy token ID
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item 
            color="red" 
            onClick={handleRevokeClick} 
            disabled={showConfirm}
            data-testid="revoke-token-item"
          >
            Revoke token…
          </Menu.Item>
          
          {showConfirm && (
            <>
              <Menu.Divider />
              <Box p="xs" data-testid="confirm-footer">
                <Group gap="xs" mb="xs">
                  <IconAlertTriangle size={16} color="var(--mantine-color-yellow-5)" />
                  <Text size="xs">Revoke this token?</Text>
                </Group>
                <Group gap="xs" justify="flex-end">
                  <Button size="xs" variant="subtle" onClick={handleCancel} data-testid="cancel-button">
                    Cancel
                  </Button>
                  <Button size="xs" color="red" onClick={handleConfirm} data-testid="confirm-revoke-button">
                    Revoke
                  </Button>
                </Group>
              </Box>
            </>
          )}
        </Menu.Dropdown>
      </Menu>

      <Button variant="outline" color="gray" size="xs" mt="md">
        Create token
      </Button>

      <Text size="xs" c="dimmed" mt="md">
        Confirmation result: <strong data-testid="confirmation-result">{confirmationResult || 'None'}</strong>
      </Text>
    </Paper>
  );
}
