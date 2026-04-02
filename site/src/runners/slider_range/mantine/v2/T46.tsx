'use client';

/**
 * slider_range-mantine-v2-T46: Inverted Grade window + Pass band in dark modal, Save
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Group,
  MantineProvider,
  Modal,
  RangeSlider,
  Text,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T46({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingGrade, setPendingGrade] = useState<[number, number]>([40, 80]);
  const [pendingPass, setPendingPass] = useState<[number, number]>([20, 60]);
  const [appliedGrade, setAppliedGrade] = useState<[number, number]>([40, 80]);
  const [appliedPass, setAppliedPass] = useState<[number, number]>([20, 60]);

  useEffect(() => {
    if (appliedGrade[0] === 60 && appliedGrade[1] === 90 && appliedPass[0] === 20 && appliedPass[1] === 60) {
      onSuccess();
    }
  }, [appliedGrade, appliedPass, onSuccess]);

  const open = () => {
    setPendingGrade([40, 80]);
    setPendingPass([20, 60]);
    setModalOpen(true);
  };

  const save = () => {
    setAppliedGrade(pendingGrade);
    setAppliedPass(pendingPass);
    setModalOpen(false);
  };

  const cancel = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Text size="xs" c="dimmed" mb="xs">
        Applied — Grade: {appliedGrade[0]}-{appliedGrade[1]}, Pass: {appliedPass[0]}-{appliedPass[1]}
      </Text>
      <Button onClick={open}>Advanced grading</Button>

      <MantineProvider forceColorScheme="dark">
        <Modal
          opened={modalOpen}
          onClose={cancel}
          title="Advanced grading"
          centered
          styles={{
            content: { backgroundColor: '#1a1b1e' },
            header: { backgroundColor: '#1a1b1e' },
          }}
        >
          <Text size="sm" mb="xs" c="white">
            Grade window (inverted)
          </Text>
          <RangeSlider
            value={pendingGrade}
            onChange={setPendingGrade}
            min={0}
            max={100}
            step={1}
            inverted
            data-testid="grade-window-range"
            mb="xs"
          />
          <Text c="dimmed" size="sm" mb="md">
            Selected: {pendingGrade[0]} - {pendingGrade[1]}
          </Text>

          <Text size="sm" mb="xs" c="white">
            Pass band
          </Text>
          <RangeSlider
            value={pendingPass}
            onChange={setPendingPass}
            min={0}
            max={100}
            step={1}
            data-testid="pass-band-range"
            mb="xs"
          />
          <Text c="dimmed" size="sm" mb="lg">
            Selected: {pendingPass[0]} - {pendingPass[1]}
          </Text>

          <Group justify="flex-end">
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </Group>
        </Modal>
      </MantineProvider>
    </div>
  );
}
