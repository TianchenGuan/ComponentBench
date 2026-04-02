'use client';

/**
 * tabs-mantine-T06: Modal editor: switch to Preview tab
 *
 * Layout: modal_flow. The page shows a single primary button labeled "Open Editor".
 * Clicking it opens a Mantine Modal titled "Editor".
 * Inside the modal is a Mantine Tabs component (default variant) with tabs: "Edit", "Preview", "History".
 * Initial state: "Edit" is active when the modal opens.
 * Clutter: low—modal also contains a close button in the corner, but closing is not required.
 * Selecting a tab updates the active tab styling and shows the corresponding panel inside the modal.
 * Success: Active tab is "Preview" (value: preview).
 */

import React, { useState } from 'react';
import { Modal, Button, Tabs, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('edit');

  const handleChange = (value: string | null) => {
    setActiveTab(value);
    if (value === 'preview') {
      onSuccess();
    }
  };

  return (
    <div>
      <Button onClick={() => setOpened(true)}>Open Editor</Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Editor" size="lg">
        <Tabs value={activeTab} onChange={handleChange}>
          <Tabs.List>
            <Tabs.Tab value="edit">Edit</Tabs.Tab>
            <Tabs.Tab value="preview">Preview</Tabs.Tab>
            <Tabs.Tab value="history">History</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="edit" pt="md">
            <Text>Edit panel - write your content here</Text>
          </Tabs.Panel>
          <Tabs.Panel value="preview" pt="md">
            <Text>Preview panel - see how your content looks</Text>
          </Tabs.Panel>
          <Tabs.Panel value="history" pt="md">
            <Text>History panel - view past versions</Text>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </div>
  );
}
