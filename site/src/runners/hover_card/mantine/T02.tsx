'use client';

/**
 * hover_card-mantine-T02: Pin a hover card open (Mantine)
 *
 * Layout: isolated_card centered, light theme, comfortable spacing.
 *
 * The card shows a single repository row with a link-styled label "Repository: ComponentBench".
 * - The link is the HoverCard.Target.
 * - Hovering opens a Mantine HoverCard.Dropdown that looks like a mini repo preview (stars, description).
 * - In the dropdown header, there is a small "Pin" icon/button.
 * - Clicking "Pin" toggles pinned=true so the dropdown remains visible even when the pointer leaves.
 *
 * Instances: 1 hover card.
 * Initial state: closed, pinned=false.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Text, Group, Stack, Popover, ActionIcon, Badge } from '@mantine/core';
import { IconPin, IconPinFilled, IconStar } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [pinned, setPinned] = useState(false);
  const successCalledRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOverTrigger = useRef(false);
  const isOverDropdown = useRef(false);

  useEffect(() => {
    if (opened && pinned && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, pinned, onSuccess]);

  const scheduleClose = useCallback(() => {
    if (pinned) return;
    closeTimer.current = setTimeout(() => {
      if (!isOverTrigger.current && !isOverDropdown.current && !pinned) {
        setOpened(false);
      }
    }, 150);
  }, [pinned]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handlePin = () => {
    setPinned(true);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Repository</Text>
      <Popover 
        width={300} 
        shadow="md"
        opened={opened}
      >
        <Popover.Target>
          <Text 
            c="blue" 
            td="underline" 
            style={{ cursor: 'pointer' }}
            data-testid="repo-trigger"
            data-cb-instance="Repository: ComponentBench"
            onMouseEnter={() => {
              isOverTrigger.current = true;
              cancelClose();
              setOpened(true);
            }}
            onMouseLeave={() => {
              isOverTrigger.current = false;
              scheduleClose();
            }}
          >
            Repository: ComponentBench
          </Text>
        </Popover.Target>
        <Popover.Dropdown 
          data-testid="hover-card-content" 
          data-cb-instance="Repository: ComponentBench"
          data-pinned={pinned}
          onMouseEnter={() => {
            isOverDropdown.current = true;
            cancelClose();
          }}
          onMouseLeave={() => {
            isOverDropdown.current = false;
            scheduleClose();
          }}
        >
          <Group justify="space-between" mb="xs">
            <Text fw={600} size="sm">ComponentBench</Text>
            <ActionIcon 
              variant="subtle" 
              size="sm"
              onClick={handlePin}
              data-testid="pin-button"
              aria-label="Pin"
            >
              {pinned ? <IconPinFilled size={16} /> : <IconPin size={16} />}
            </ActionIcon>
          </Group>
          <Text size="xs" c="dimmed" mb="sm">
            A benchmark suite for evaluating UI component interactions.
          </Text>
          <Group gap="xs">
            <Badge size="sm" variant="light" leftSection={<IconStar size={12} />}>
              1.2k
            </Badge>
            <Badge size="sm" variant="light" color="gray">
              TypeScript
            </Badge>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
