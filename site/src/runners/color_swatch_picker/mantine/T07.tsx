'use client';

/**
 * color_swatch_picker-mantine-T07: Choose Violet and save in modal
 *
 * Layout: modal_flow with a button that opens a modal.
 * The modal contains a ColorInput and requires clicking "Save" to commit.
 *
 * Initial state: Committed Badge color is #228be6.
 * Success: Committed color equals #7950f2 after clicking Save.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Button, Modal, Select, Stack, Group, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#7950f2';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [committedColor, setCommittedColor] = useState<string>('#228be6');
  const [pendingColor, setPendingColor] = useState<string>('#228be6');
  const [badgeSize, setBadgeSize] = useState<string>('md');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(committedColor, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [committedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleOpen = () => {
    setPendingColor(committedColor);
    open();
  };

  const handleSave = () => {
    setCommittedColor(pendingColor);
    close();
  };

  const handleCancel = () => {
    setPendingColor(committedColor);
    close();
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Stack gap="md">
          <Group>
            <Badge color={committedColor} size={badgeSize as any}>
              Sample Badge
            </Badge>
            <Text c="dimmed" size="sm">Current color: {committedColor}</Text>
          </Group>
          <Button onClick={handleOpen}>
            Customize badge
          </Button>
        </Stack>
      </Card>

      <Modal opened={opened} onClose={handleCancel} title="Customize badge">
        <Stack gap="md">
          <Badge color={pendingColor} size={badgeSize as any}>
            Preview Badge
          </Badge>
          
          <Select
            label="Badge size"
            value={badgeSize}
            onChange={(val) => setBadgeSize(val || 'md')}
            data={[
              { value: 'xs', label: 'Extra Small' },
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' },
            ]}
          />
          
          <div data-testid="badge-color">
            <ColorInput
              label="Badge color"
              value={pendingColor}
              onChange={setPendingColor}
              format="hex"
              swatches={MANTINE_SWATCHES}
              withPicker={false}
            />
          </div>
          
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>

      <div data-testid="badge-color-committed" style={{ display: 'none' }}>
        {normalizeHex(committedColor)}
      </div>
    </>
  );
}
