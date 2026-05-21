'use client';

/**
 * breadcrumb-mantine-T04: Expand collapsed breadcrumb (Mantine)
 * 
 * Centered card titled "Deep Page".
 * Mantine Breadcrumbs showing: Home > ... > Section > Deep Page
 * The ellipsis is clickable. Clicking expands to show Level 1, 2, 3.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card, Menu } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (expanded) return;
    setExpanded(true);
    onSuccess();
  };

  const hiddenItems = ['Level 1', 'Level 2', 'Level 3'];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text size="lg" fw={600} mb="md">Deep Page</Text>
      
      <Breadcrumbs mb="md" data-testid="mantine-breadcrumb-collapsed" data-expanded={expanded}>
        <Text>Home</Text>
        {expanded ? (
          <>
            {hiddenItems.map((item) => (
              <Anchor key={item} component="button" style={{ cursor: 'pointer' }}>
                {item}
              </Anchor>
            ))}
          </>
        ) : (
          <Menu shadow="md" width={120} opened={false}>
            <Menu.Target>
              <Anchor
                component="button"
                onClick={handleExpand}
                data-testid="mantine-breadcrumb-ellipsis"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <IconDots size={16} />
              </Anchor>
            </Menu.Target>
          </Menu>
        )}
        <Anchor component="button" style={{ cursor: 'pointer' }}>
          Section
        </Anchor>
        <Text>Deep Page</Text>
      </Breadcrumbs>

      {expanded ? (
        <Text c="green" fw={500}>
          Hidden items revealed: {hiddenItems.join(', ')}
        </Text>
      ) : (
        <Text>
          Click the ellipsis (...) to see the hidden breadcrumb items.
        </Text>
      )}
    </Card>
  );
}
