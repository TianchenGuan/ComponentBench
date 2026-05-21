'use client';

/**
 * menu_button-mantine-T02: Choose Rename action
 * 
 * Layout: isolated_card centered titled "File".
 * There is one menu button labeled "File actions: None".
 * It is a Mantine Menu with a Button target.
 * The dropdown contains three items: "Rename", "Move", "Delete".
 * 
 * Selecting an item closes the menu and updates the button label.
 * Initial state: None selected.
 * Success: The selected value equals "Rename".
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedAction === 'Rename' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedAction, successTriggered, onSuccess]);

  const handleSelect = (action: string) => {
    setSelectedAction(action);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">File</Text>
      
      <Menu>
        <Menu.Target>
          <Button
            variant="default"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-file-actions"
          >
            File actions: {selectedAction || 'None'}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => handleSelect('Rename')}>Rename</Menu.Item>
          <Menu.Item onClick={() => handleSelect('Move')}>Move</Menu.Item>
          <Menu.Item onClick={() => handleSelect('Delete')}>Delete</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Card>
  );
}
