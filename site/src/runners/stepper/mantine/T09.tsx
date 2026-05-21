'use client';

/**
 * stepper-mantine-T09: Table cell (Mantine): match Billing wizard to reference
 *
 * Layout: table_cell (small table of wizards; each row contains a compact stepper).
 * Two rows: "Billing wizard" (TARGET) and "Shipping wizard" (distractor).
 * Steps in each: "Info" → "Details" → "Review" → "Confirm".
 * A reference badge above the table shows which step to match (e.g., "Review").
 * Initial state: Billing active = 0 ("Info"), Shipping active = 2 ("Review").
 * Success: Billing wizard active step matches the reference badge (index 2 "Review").
 */

import React, { useState } from 'react';
import { Stepper, Card, Text, Table, TextInput, Box, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const steps = ['Info', 'Details', 'Review', 'Confirm'];
const TARGET_STEP_INDEX = 2;
const TARGET_STEP_LABEL = 'Review';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [billingStep, setBillingStep] = useState(0);
  const [shippingStep, setShippingStep] = useState(2);

  const handleBillingStep = (step: number) => {
    setBillingStep(step);
    if (step === TARGET_STEP_INDEX) {
      onSuccess();
    }
  };

  return (
    <Box style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">
        Active Wizards
      </Text>

      {/* Reference badge */}
      <Card
        shadow="sm"
        padding="sm"
        radius="md"
        withBorder
        mb="md"
        data-testid="billing-preview"
        data-target-step={TARGET_STEP_LABEL}
      >
        <Text size="sm" fw={500} mb="xs">Reference Badge</Text>
        <Box style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {steps.map((step, idx) => (
            <Box
              key={step}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: idx === TARGET_STEP_INDEX ? '#228be6' : '#e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: idx === TARGET_STEP_INDEX ? '#fff' : '#868e96',
              }}
            >
              {idx + 1}
            </Box>
          ))}
          <Badge color="blue" variant="light" ml="sm">
            {TARGET_STEP_LABEL}
          </Badge>
        </Box>
      </Card>

      {/* Distractors */}
      <Box style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <TextInput placeholder="Search..." size="xs" style={{ width: 200 }} />
      </Box>

      {/* Table with steppers */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Wizard</Table.Th>
              <Table.Th>Progress</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr data-row-id="billing" data-testid="stepper-billing-wizard">
              <Table.Td>Billing wizard</Table.Td>
              <Table.Td>
                <Stepper
                  active={billingStep}
                  onStepClick={handleBillingStep}
                  size="xs"
                  style={{ minWidth: 400 }}
                >
                  {steps.map((step) => (
                    <Stepper.Step key={step} label={step} />
                  ))}
                </Stepper>
              </Table.Td>
            </Table.Tr>
            <Table.Tr data-row-id="shipping" data-testid="stepper-shipping-wizard">
              <Table.Td>Shipping wizard</Table.Td>
              <Table.Td>
                <Stepper
                  active={shippingStep}
                  onStepClick={setShippingStep}
                  size="xs"
                  style={{ minWidth: 400 }}
                >
                  {steps.map((step) => (
                    <Stepper.Step key={step} label={step} />
                  ))}
                </Stepper>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}
