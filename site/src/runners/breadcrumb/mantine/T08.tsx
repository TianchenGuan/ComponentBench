'use client';

/**
 * breadcrumb-mantine-T08: Navigate in cluttered form (Mantine)
 * 
 * Form section with high clutter (form fields, buttons, labels).
 * Mantine Breadcrumbs: Admin > Forms > Contact > Edit
 * Navigate to "Forms".
 */

import React, { useState } from 'react';
import { Breadcrumbs, Anchor, Text, Card, TextInput, Textarea, Stack, Button } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Forms') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text size="lg" fw={600} mb="md">Edit Contact Form</Text>
      
      <Breadcrumbs mb="lg">
        <Anchor
          component="button"
          onClick={() => handleNavigate('Admin')}
          data-testid="mantine-breadcrumb-admin"
          style={{ cursor: 'pointer' }}
        >
          Admin
        </Anchor>
        <Anchor
          component="button"
          onClick={() => handleNavigate('Forms')}
          data-testid="mantine-breadcrumb-forms"
          style={{ cursor: 'pointer' }}
        >
          Forms
        </Anchor>
        <Anchor
          component="button"
          onClick={() => handleNavigate('Contact')}
          data-testid="mantine-breadcrumb-contact"
          style={{ cursor: 'pointer' }}
        >
          Contact
        </Anchor>
        <Text data-testid="mantine-breadcrumb-edit">Edit</Text>
      </Breadcrumbs>

      {navigated ? (
        <Text c="green" fw={500}>
          Navigated to: {navigated}
        </Text>
      ) : (
        <Stack>
          <TextInput label="Form Name" placeholder="Contact Us" />
          <TextInput label="Recipient Email" placeholder="contact@example.com" />
          <Textarea label="Success Message" placeholder="Thanks for your message!" rows={2} />
          <Button variant="outline" size="sm" style={{ alignSelf: 'flex-start' }}>
            Save Changes
          </Button>
        </Stack>
      )}
    </Card>
  );
}
