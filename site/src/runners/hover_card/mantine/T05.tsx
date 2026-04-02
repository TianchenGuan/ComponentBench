'use client';

/**
 * hover_card-mantine-T05: Expand a 'More info' section inside HoverCard
 *
 * Layout: form_section centered (light theme, comfortable spacing).
 *
 * The page shows a compliance form section with a line:
 * - "Data retention policy" (rendered as an underlined inline link). This is the HoverCard.Target.
 *
 * Hovering opens a Mantine HoverCard.Dropdown containing:
 * - A one-sentence summary
 * - A collapsed disclosure row labeled "More info" with a chevron
 * - When expanded, it reveals two additional bullet points (retention window, deletion behavior)
 *
 * Instances: 1 hover card.
 * Initial state: dropdown closed, "More info" collapsed.
 * Clutter: low (other form fields present but not required).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Stack, Popover, UnstyledButton, Collapse, Group, List } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (opened && expanded && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, expanded, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Compliance Settings</Text>
      <Stack gap="md">
        <TextInput label="Organization name" placeholder="Enter organization name" />
        <TextInput label="Contact email" placeholder="Enter email" type="email" />
        <div>
          <Text size="sm" c="dimmed" mb={4}>Policy</Text>
          <Popover 
            width={300} 
            shadow="md"
            opened={opened}
            onChange={(isOpen: boolean) => {
              setOpened(isOpen);
              if (!isOpen) setExpanded(false);
            }}
          >
            <Popover.Target>
              <Text 
                c="blue" 
                td="underline"
                style={{ cursor: 'pointer' }}
                data-testid="data-retention-trigger"
                data-cb-instance="Data retention policy"
                onMouseEnter={() => setOpened(true)}
                onMouseLeave={() => setOpened(false)}
              >
                Data retention policy
              </Text>
            </Popover.Target>
            <Popover.Dropdown onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)} 
              data-testid="hover-card-content" 
              data-cb-instance="Data retention policy"
              data-details-expanded={expanded}
            >
              <Stack gap="sm">
                <Text size="sm">
                  Your data is retained according to your subscription plan and regulatory requirements.
                </Text>
                <UnstyledButton
                  onClick={() => setExpanded(!expanded)}
                  data-testid="more-info-button"
                >
                  <Group gap={4}>
                    <Text size="sm" c="blue">More info</Text>
                    {expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                  </Group>
                </UnstyledButton>
                <Collapse in={expanded}>
                  <List size="xs" spacing="xs" mt="xs">
                    <List.Item>Retention window: 90 days after account closure</List.Item>
                    <List.Item>Deletion: Permanent and irreversible upon request</List.Item>
                  </List>
                </Collapse>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </div>
      </Stack>
    </Card>
  );
}
