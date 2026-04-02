'use client';

/**
 * popover-mantine-T07: Open nested Advanced filters popover inside Filters popover
 *
 * Isolated card centered in the viewport titled 'Search'.
 * A button labeled 'Filters' toggles the outer Mantine Popover (position='bottom', withArrow).
 * Inside the outer dropdown, there is a compact row labeled 'Advanced filters' with a small ActionIcon.
 * Inner popover is configured to render without Portal (withinPortal=false) to support nesting.
 * Initial state: both popovers closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Popover, ActionIcon, Stack, Checkbox, Group } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [outerOpened, setOuterOpened] = useState(false);
  const [innerOpened, setInnerOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (outerOpened && innerOpened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [outerOpened, innerOpened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Search
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Open Filters, then view Advanced filters inside.
      </Text>
      
      <Popover
        opened={outerOpened}
        onChange={setOuterOpened}
        width={280}
        position="bottom"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <Button
            onClick={() => setOuterOpened((o) => !o)}
            data-testid="popover-target-filters"
          >
            Filters
          </Button>
        </Popover.Target>
        <Popover.Dropdown data-testid="popover-filters">
          <Stack gap="sm">
            <Text fw={500} size="sm">Filter options</Text>
            <Checkbox label="In stock only" />
            <Checkbox label="Free shipping" />
            <Checkbox label="On sale" />
            
            <Group gap="xs" mt="xs">
              <Text size="sm">Advanced filters</Text>
              <Popover
                opened={innerOpened}
                onChange={setInnerOpened}
                width={220}
                position="right"
                withArrow
                shadow="md"
                withinPortal={false}
              >
                <Popover.Target>
                  <ActionIcon
                    variant="subtle"
                    size="xs"
                    onClick={() => setInnerOpened((o) => !o)}
                    data-testid="popover-target-advanced-filters"
                  >
                    <IconInfoCircle size={14} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown data-testid="popover-advanced-filters">
                  <Text fw={500} size="sm" mb="xs">Advanced filters</Text>
                  <Text size="xs">
                    Advanced filters allow you to filter by price range, brand, rating, and more specific criteria.
                  </Text>
                </Popover.Dropdown>
              </Popover>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
