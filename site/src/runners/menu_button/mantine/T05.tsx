'use client';

/**
 * menu_button-mantine-T05: Add tag using search in menu
 * 
 * Layout: isolated_card centered titled "Tags".
 * One menu button labeled "Add tag: None" opens a Mantine Menu.Dropdown.
 * At the top of the dropdown is a small TextInput with placeholder "Search tags…".
 * Below it is a scrollable list of tag items.
 * 
 * Typing filters the list in-place.
 * Selecting a tag closes the dropdown and updates the trigger.
 * 
 * Initial state: None.
 * Success: The selected tag equals "Legal".
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Menu, Text, TextInput, ScrollArea } from '@mantine/core';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const allTags = [
  'Finance', 'Marketing', 'Legal', 'Sales', 'Support',
  'Engineering', 'Design', 'Product', 'HR', 'Operations',
  'Research', 'Analytics', 'Security', 'Compliance', 'Strategy',
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [opened, setOpened] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedTag === 'Legal' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedTag, successTriggered, onSuccess]);

  const filteredTags = useMemo(() => {
    if (!searchQuery) return allTags;
    return allTags.filter(tag =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelect = (tag: string) => {
    setSelectedTag(tag);
    setOpened(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpened(isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tags</Text>
      
      <Menu opened={opened} onChange={handleOpenChange}>
        <Menu.Target>
          <Button
            variant="default"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-add-tag"
          >
            Add tag: {selectedTag || 'None'}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <div style={{ padding: '4px 8px' }}>
            <TextInput
              placeholder="Search tags…"
              size="xs"
              leftSection={<IconSearch size={14} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          <Menu.Divider />
          <ScrollArea.Autosize mah={200}>
            {filteredTags.map(tag => (
              <Menu.Item
                key={tag}
                onClick={() => handleSelect(tag)}
              >
                {tag}
              </Menu.Item>
            ))}
            {filteredTags.length === 0 && (
              <Menu.Item disabled>No tags found</Menu.Item>
            )}
          </ScrollArea.Autosize>
        </Menu.Dropdown>
      </Menu>
    </Card>
  );
}
