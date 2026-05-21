'use client';

/**
 * slider_single-mantine-v2-T39: Effects section below fold — small thumb Opacity + Apply effects
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Drawer, Group, ScrollArea, Slider, Stack, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T39({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blur, setBlur] = useState(20);
  const [opacity, setOpacity] = useState(40);
  const [appliedBlur, setAppliedBlur] = useState(20);
  const [appliedOpacity, setAppliedOpacity] = useState(40);

  useEffect(() => {
    if (appliedOpacity === 62 && appliedBlur === 20) {
      onSuccess();
    }
  }, [appliedBlur, appliedOpacity, onSuccess]);

  const open = () => {
    setBlur(appliedBlur);
    setOpacity(appliedOpacity);
    setDrawerOpen(true);
  };

  const apply = () => {
    setAppliedBlur(blur);
    setAppliedOpacity(opacity);
    setDrawerOpen(false);
  };

  const cancel = () => {
    setBlur(appliedBlur);
    setOpacity(appliedOpacity);
    setDrawerOpen(false);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 360 }}>
      <Text fw={600} size="sm" mb="xs">
        Studio settings
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Effects: blur {appliedBlur} · opacity {appliedOpacity}
      </Text>
      <Button size="sm" onClick={open} data-testid="btn-open-effects-settings">
        Open effects settings
      </Button>

      <Drawer opened={drawerOpen} onClose={cancel} title="Effects" position="right" size="md">
        <ScrollArea h={280} type="auto" offsetScrollbars>
          <Stack gap="lg" pr="xs">
            <div>
              <Text fw={500} size="sm" mb="xs">
                Blur amount
              </Text>
              <Slider
                value={blur}
                onChange={setBlur}
                min={0}
                max={100}
                step={1}
                data-testid="slider-blur-amount"
              />
              <Text size="xs" c="dimmed" mt={4}>
                {blur}
              </Text>
            </div>
            <Text size="xs" c="dimmed">
              Sharpening, noise reduction, and lens profiles apply in order. Scroll down for the Effects section.{' '}
              {Array.from({ length: 6 }, () => 'Additional pipeline notes fill vertical space.').join(' ')}
            </Text>
            <div>
              <Text fw={600} size="sm" mb="xs">
                Effects
              </Text>
              <Text fw={500} size="sm" mb="xs">
                Opacity
              </Text>
              <Slider
                value={opacity}
                onChange={setOpacity}
                min={0}
                max={100}
                step={1}
                thumbSize={14}
                labelAlwaysOn
                label={(v) => `${v}%`}
                data-testid="slider-opacity"
              />
              <Text size="xs" c="dimmed" mt={4}>
                {opacity}%
              </Text>
            </div>
          </Stack>
        </ScrollArea>
        <Group justify="flex-end" gap="xs" mt="md">
          <Button variant="default" size="xs" onClick={cancel}>
            Cancel
          </Button>
          <Button size="xs" onClick={apply} data-testid="btn-apply-effects">
            Apply effects
          </Button>
        </Group>
      </Drawer>
    </Card>
  );
}
