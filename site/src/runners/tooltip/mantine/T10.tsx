'use client';

/**
 * tooltip-mantine-T10: Open modal in dark theme then show tooltip
 *
 * DARK theme, COMPACT spacing, modal_flow layout centered.
 * The page shows a button "Advanced options". Clicking it opens a Mantine Modal.
 * Inside the modal, there is a row labeled "Advanced mode" with a small info icon next to the label. The icon is wrapped in Mantine Tooltip:
 * - label: "Enables additional configuration fields"
 * Scale: small (compact modal content). The modal contains other controls (checkboxes, text inputs) as clutter, but none have tooltips.
 * Initial state: modal closed; tooltip hidden.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Text, Tooltip, ActionIcon, TextInput, Checkbox, MantineProvider } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Enables additional configuration fields')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <div style={{ padding: 24 }}>
        <Button onClick={() => setOpened(true)}>
          Advanced options
        </Button>

        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Advanced options"
          size="sm"
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <Text size="sm" fw={500}>Advanced mode</Text>
              <Tooltip label="Enables additional configuration fields">
                <ActionIcon variant="subtle" size="xs" data-testid="tooltip-trigger-advanced">
                  <IconInfoCircle size={14} />
                </ActionIcon>
              </Tooltip>
            </div>
            <Checkbox label="Enable advanced mode" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text size="sm" fw={500} mb={4}>Custom endpoint</Text>
            <TextInput placeholder="https://api.example.com" size="sm" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text size="sm" fw={500} mb={4}>Timeout (ms)</Text>
            <TextInput placeholder="5000" size="sm" />
          </div>

          <Checkbox label="Debug mode" />
        </Modal>
      </div>
    </MantineProvider>
  );
}
