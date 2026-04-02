'use client';

/**
 * slider_single-mantine-v2-T38: Advanced grading modal (dark) — inverted Grade threshold + Save
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Group, MantineProvider, Modal, Slider, Stack, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T38({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [grade, setGrade] = useState(60);
  const [curve, setCurve] = useState(45);
  const [appliedGrade, setAppliedGrade] = useState(60);
  const [appliedCurve, setAppliedCurve] = useState(45);

  useEffect(() => {
    if (appliedGrade === 30 && appliedCurve === 45) {
      onSuccess();
    }
  }, [appliedCurve, appliedGrade, onSuccess]);

  const open = () => {
    setGrade(appliedGrade);
    setCurve(appliedCurve);
    setOpened(true);
  };

  const save = () => {
    setAppliedGrade(grade);
    setAppliedCurve(curve);
    setOpened(false);
  };

  const cancel = () => {
    setGrade(appliedGrade);
    setCurve(appliedCurve);
    setOpened(false);
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <Card
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        style={{ width: 380, background: 'var(--mantine-color-dark-7)' }}
      >
        <Text fw={600} size="sm" mb="xs">
          Grading
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          Saved: threshold {appliedGrade} · curve {appliedCurve}
        </Text>
        <Button size="sm" onClick={open} data-testid="btn-advanced-grading">
          Advanced grading
        </Button>

        <Modal opened={opened} onClose={cancel} title="Advanced grading" centered size="md">
          <Stack gap="lg">
            <div>
              <Text fw={500} size="sm" mb="xs">
                Grade threshold
              </Text>
              <Slider
                value={grade}
                onChange={setGrade}
                min={0}
                max={100}
                step={1}
                inverted
                data-testid="slider-grade-threshold"
              />
              <Text size="xs" c="dimmed" mt={6}>
                {grade}
              </Text>
            </div>
            <div>
              <Text fw={500} size="sm" mb="xs">
                Curve strength
              </Text>
              <Slider
                value={curve}
                onChange={setCurve}
                min={0}
                max={100}
                step={1}
                data-testid="slider-curve-strength"
              />
              <Text size="xs" c="dimmed" mt={6}>
                {curve}
              </Text>
            </div>
            <Group justify="flex-end" gap="xs">
              <Button variant="default" size="xs" onClick={cancel}>
                Cancel
              </Button>
              <Button size="xs" onClick={save} data-testid="btn-save-grading">
                Save
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Card>
    </MantineProvider>
  );
}
