'use client';

/**
 * drawer-mantine-T08: Scroll to bottom action to close a Mantine drawer (privacy notice)
 *
 * Layout: form_section in the center of the viewport. Clutter is LOW: the page shows a few read-only profile fields behind the drawer.
 *
 * Initial state:
 * - A Mantine Drawer titled "Privacy notice" is OPEN on page load.
 * - The drawer contains a long scrollable notice (multiple paragraphs) so the bottom action is not initially visible.
 *
 * Target component configuration:
 * - withCloseButton = false (no header X icon).
 * - closeOnEscape = false.
 * - closeOnClickOutside = false.
 * - The ONLY closing control is a button labeled "Accept & close" located at the bottom of the drawer content (not sticky).
 *
 * Interaction requirement:
 * - The agent must scroll inside the drawer content area to reveal the bottom button.
 *
 * Feedback:
 * - Clicking "Accept & close" closes the drawer and removes the overlay.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Drawer, Stack, Title, TextInput, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Start open
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Profile Settings
      </Text>
      <Stack gap="sm">
        <TextInput label="Name" value="John Doe" disabled />
        <TextInput label="Email" value="john@example.com" disabled />
      </Stack>

      <Drawer
        opened={opened}
        onClose={() => {}}
        title="Privacy notice"
        position="right"
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
        data-testid="drawer-privacy-notice"
      >
        <ScrollArea style={{ height: 'calc(100vh - 120px)' }}>
          <Stack gap="md" style={{ minHeight: '150vh', paddingBottom: 32 }}>
            <Title order={5}>1. Introduction</Title>
            <Text size="sm">
              This Privacy Notice describes how we collect, use, and share your personal information when you use our services. We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner.
            </Text>

            <Title order={5}>2. Information We Collect</Title>
            <Text size="sm">
              We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, and payment information.
            </Text>
            <Text size="sm">
              We also automatically collect certain information when you use our services, including your IP address, browser type, device information, and usage data through cookies and similar technologies.
            </Text>

            <Title order={5}>3. How We Use Your Information</Title>
            <Text size="sm">
              We use the information we collect to provide and improve our services, process transactions, send you updates and marketing communications, and comply with legal obligations.
            </Text>

            <Title order={5}>4. Information Sharing</Title>
            <Text size="sm">
              We may share your information with third-party service providers who help us operate our business, such as payment processors and cloud hosting providers. We may also share information when required by law or to protect our rights.
            </Text>

            <Title order={5}>5. Data Retention</Title>
            <Text size="sm">
              We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements.
            </Text>

            <Title order={5}>6. Your Rights</Title>
            <Text size="sm">
              Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, delete, or port your data. You may also have the right to opt out of certain processing activities.
            </Text>

            <Title order={5}>7. Security</Title>
            <Text size="sm">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </Text>

            <Title order={5}>8. Contact Us</Title>
            <Text size="sm">
              If you have any questions about this Privacy Notice or our data practices, please contact our privacy team.
            </Text>

            <Button
              mt="xl"
              onClick={() => setOpened(false)}
              data-testid="privacy-accept-close"
            >
              Accept & close
            </Button>
          </Stack>
        </ScrollArea>
      </Drawer>
    </Card>
  );
}
