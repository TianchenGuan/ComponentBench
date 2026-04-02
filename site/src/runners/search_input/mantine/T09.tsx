'use client';

/**
 * search_input-mantine-T09: Modal search: replace value, select suggestion, and confirm
 *
 * Modal flow: main page shows a button "Search menu".
 * Clicking opens a centered Modal titled "Search menu".
 * Inside is a Mantine Autocomplete labeled "Menu search" with a clear button when filled.
 * Initial state: prefilled value "cafe" (without accent). Suggestions include: café au lait, café noir, cafetera, cafeteria.
 * Clutter is medium: the modal also shows two non-required toggles ("Vegetarian only", "Open now").
 * Confirmation: a primary button labeled "Search" at the bottom of the modal commits the search.
 * Feedback: clicking Search shows a short loading state and then displays "Last searched: café noir" within the modal.
 * Closing the modal is not required.
 *
 * Success: Inside the modal, the Autocomplete labeled "Menu search" has submitted_query equal to "café noir" after clicking the modal Search button.
 */

import React, { useState, useRef } from 'react';
import { Button, Modal, Autocomplete, Text, Switch, Stack, Loader, CloseButton, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const menuItems = ['café au lait', 'café noir', 'cafetera', 'cafeteria'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState('cafe');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasSucceeded = useRef(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmittedQuery(value);
      if (value === 'café noir' && !hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }, 500);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Search menu
      </Button>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Search menu"
        size="md"
      >
        <Stack gap="md">
          <Box pos="relative">
            <Autocomplete
              label="Menu search"
              placeholder="Search menu items…"
              data={menuItems}
              value={value}
              onChange={setValue}
              data-testid="search-menu"
              rightSection={
                value ? (
                  <CloseButton
                    size="sm"
                    onClick={() => setValue('')}
                    aria-label="Clear input"
                  />
                ) : null
              }
            />
          </Box>

          <Switch label="Vegetarian only" />
          <Switch label="Open now" />

          {submittedQuery && (
            <Text size="sm" c="dimmed">
              Last searched: {submittedQuery}
            </Text>
          )}

          <Button 
            onClick={handleSearch} 
            loading={loading}
            fullWidth
          >
            {loading ? <Loader size="sm" /> : 'Search'}
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
