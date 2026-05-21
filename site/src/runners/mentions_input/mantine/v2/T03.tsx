'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Textarea, Text, Popover, UnstyledButton, Stack, Button, Drawer, Group, Box, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps, UserSuggestion } from '../../types';
import { EXTENDED_USERS, normalizeWhitespace, deriveMentionsFromText } from '../../types';

const INITIAL_SIDEBAR = 'Sidebar copy stays unchanged.';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const [updateValue, setUpdateValue] = useState('');
  const updateMentions = deriveMentionsFromText(updateValue, EXTENDED_USERS);
  const [updateOpened, setUpdateOpened] = useState(false);
  const [updateMentionStart, setUpdateMentionStart] = useState<number | null>(null);
  const [updateFilterText, setUpdateFilterText] = useState('');
  const updateRef = useRef<HTMLTextAreaElement>(null);

  const [sidebarValue, setSidebarValue] = useState(INITIAL_SIDEBAR);
  const sidebarMentions = deriveMentionsFromText(sidebarValue, EXTENDED_USERS);
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [sidebarMentionStart, setSidebarMentionStart] = useState<number | null>(null);
  const [sidebarFilterText, setSidebarFilterText] = useState('');
  const sidebarRef = useRef<HTMLTextAreaElement>(null);

  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const makeMentionHandler = (
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setStart: React.Dispatch<React.SetStateAction<number | null>>,
    setFilter: React.Dispatch<React.SetStateAction<string>>,
  ) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    setValue(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const charBeforeAt = lastAtIndex > 0 ? newValue[lastAtIndex - 1] : ' ';
      if ((charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0) && !textAfterAt.includes(' ')) {
        setStart(lastAtIndex);
        setFilter(textAfterAt.toLowerCase());
        setOpened(true);
        return;
      }
    }
    setOpened(false);
    setStart(null);
  };

  const makeSelectHandler = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    filterText: string,
    mentionStart: number | null,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setStart: React.Dispatch<React.SetStateAction<number | null>>,
    ref: React.RefObject<HTMLTextAreaElement | null>,
  ) => (user: UserSuggestion) => {
    if (mentionStart === null) return;
    const before = value.substring(0, mentionStart);
    const after = value.substring(mentionStart + 1 + filterText.length);
    setValue(`${before}@${user.label}${after}`);
    setOpened(false);
    setStart(null);
    ref.current?.focus();
  };

  const handleUpdateChange = makeMentionHandler(setUpdateValue, setUpdateOpened, setUpdateMentionStart, setUpdateFilterText);
  const handleSidebarChange = makeMentionHandler(setSidebarValue, setSidebarOpened, setSidebarMentionStart, setSidebarFilterText);
  const handleUpdateSelect = makeSelectHandler(updateValue, setUpdateValue, updateFilterText, updateMentionStart, setUpdateOpened, setUpdateMentionStart, updateRef);
  const handleSidebarSelect = makeSelectHandler(sidebarValue, setSidebarValue, sidebarFilterText, sidebarMentionStart, setSidebarOpened, setSidebarMentionStart, sidebarRef);

  const updateFiltered = EXTENDED_USERS.filter(u => u.label.toLowerCase().includes(updateFilterText));
  const sidebarFiltered = EXTENDED_USERS.filter(u => u.label.toLowerCase().includes(sidebarFilterText));

  const handleApply = () => {
    setSaved(true);
    closeDrawer();
  };

  useEffect(() => {
    if (hasSucceeded.current || !saved) return;
    const normalizedUpdate = normalizeWhitespace(updateValue);
    const target = 'FYI @Carlos Reyes and @Jun Ito.';
    const sidebarUnchanged = normalizeWhitespace(sidebarValue) === normalizeWhitespace(INITIAL_SIDEBAR);

    if (
      normalizedUpdate === target &&
      updateMentions.length === 2 &&
      updateMentions[0].id === 'carlos' &&
      updateMentions[1].id === 'jun' &&
      sidebarUnchanged
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [saved, updateValue, updateMentions, sidebarValue, onSuccess]);

  const renderDropdown = (
    filtered: UserSuggestion[],
    onSelect: (u: UserSuggestion) => void,
    prefix: string,
  ) => (
    <Popover.Dropdown>
      <ScrollArea h={180}>
        <Stack gap={2}>
          {filtered.map(user => (
            <UnstyledButton
              key={user.id}
              onClick={() => onSelect(user)}
              data-testid={`${prefix}-option-${user.id}`}
              style={{ padding: '6px 10px', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {user.label}
            </UnstyledButton>
          ))}
        </Stack>
      </ScrollArea>
    </Popover.Dropdown>
  );

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 340 }}>
        <Text fw={600} size="lg" mb="md">Update Panel</Text>
        <Text size="sm" c="dimmed" mb="md">
          Open the drawer to compose an update message.
        </Text>
        <Button onClick={openDrawer} data-testid="edit-update-button">
          Edit update
        </Button>
      </Card>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="md"
        title={<Text fw={500}>Edit update</Text>}
      >
        <Box p="md">
          <Box mb="lg">
            <Text size="sm" fw={500} mb={4}>Update message</Text>
            <Popover opened={updateOpened} position="bottom-start" width="target" withinPortal>
              <Popover.Target>
                <Textarea
                  ref={updateRef}
                  placeholder="Type @ to mention"
                  value={updateValue}
                  onChange={handleUpdateChange}
                  minRows={3}
                  data-testid="update-message-textarea"
                />
              </Popover.Target>
              {renderDropdown(updateFiltered, handleUpdateSelect, 'update')}
            </Popover>
            <Text size="xs" c="dimmed" mt={4}>
              Detected mentions: {updateMentions.length > 0 ? updateMentions.map(m => m.label).join(', ') : '(none)'}
            </Text>
          </Box>

          <Box mb="lg">
            <Text size="sm" fw={500} mb={4}>Sidebar note</Text>
            <Popover opened={sidebarOpened} position="bottom-start" width="target" withinPortal>
              <Popover.Target>
                <Textarea
                  ref={sidebarRef}
                  value={sidebarValue}
                  onChange={handleSidebarChange}
                  minRows={2}
                  data-testid="sidebar-note-textarea"
                />
              </Popover.Target>
              {renderDropdown(sidebarFiltered, handleSidebarSelect, 'sidebar')}
            </Popover>
            <Text size="xs" c="dimmed" mt={4}>
              Detected mentions: {sidebarMentions.length > 0 ? sidebarMentions.map(m => m.label).join(', ') : '(none)'}
            </Text>
          </Box>

          <Group>
            <Button variant="default" onClick={closeDrawer}>Cancel</Button>
            <Button onClick={handleApply} data-testid="apply-update-button">Apply update</Button>
          </Group>
        </Box>
      </Drawer>
    </>
  );
}
