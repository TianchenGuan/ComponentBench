'use client';

/**
 * tree_select-mantine-T06: Billing category from reference chip (2 instances, mixed)
 *
 * Layout: isolated_card centered titled "Chargeback rules".
 * Target components: TWO composite TreeSelects with similar styling:
 *   1) "Shipping category" (pre-filled with "Logistics / Shipping")
 *   2) "Billing category" (empty) ← TARGET
 * Both TreeSelects share the same category tree:
 *   - Finance → (Operations, Payroll, Taxes)
 *   - Logistics → (Shipping, Warehousing)
 *   - IT → (Devices, Accounts)
 * Mixed guidance: A "Reference" row shows colored chips including "FIN‑OPS" = Finance → Operations.
 *
 * Success: The TreeSelect labeled "Billing category" matches the reference chip FIN‑OPS.
 * Canonical target is path [Finance, Operations] with value 'cat_finance_operations'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, Badge, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'finance',
    label: 'Finance',
    children: [
      { value: 'cat_finance_operations', label: 'Operations' },
      { value: 'cat_finance_payroll', label: 'Payroll' },
      { value: 'cat_finance_taxes', label: 'Taxes' },
    ],
  },
  {
    value: 'logistics',
    label: 'Logistics',
    children: [
      { value: 'cat_logistics_shipping', label: 'Shipping' },
      { value: 'cat_logistics_warehousing', label: 'Warehousing' },
    ],
  },
  {
    value: 'it',
    label: 'IT',
    children: [
      { value: 'cat_it_devices', label: 'Devices' },
      { value: 'cat_it_accounts', label: 'Accounts' },
    ],
  },
];

const valueLabels: Record<string, string> = {
  cat_finance_operations: 'Finance / Operations',
  cat_finance_payroll: 'Finance / Payroll',
  cat_finance_taxes: 'Finance / Taxes',
  cat_logistics_shipping: 'Logistics / Shipping',
  cat_logistics_warehousing: 'Logistics / Warehousing',
  cat_it_devices: 'IT / Devices',
  cat_it_accounts: 'IT / Accounts',
};

const leafValues = new Set(Object.keys(valueLabels));

export default function T06({ onSuccess }: TaskComponentProps) {
  const [shippingCategory, setShippingCategory] = useState<string | null>('cat_logistics_shipping');
  const [billingCategory, setBillingCategory] = useState<string | null>(null);
  const [openedField, setOpenedField] = useState<'shipping' | 'billing' | null>(null);
  const treeShipping = useTree();
  const treeBilling = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && billingCategory === 'cat_finance_operations') {
      successFired.current = true;
      onSuccess();
    }
  }, [billingCategory, onSuccess]);

  const createRenderNode = (setValue: (val: string) => void, closePopover: () => void) => {
    return ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => (
      <Group
        gap={5}
        {...elementProps}
        onClick={(e) => {
          if (hasChildren) {
            treeController.toggleExpanded(node.value);
          } else if (leafValues.has(node.value)) {
            setValue(node.value);
            closePopover();
          }
          e.stopPropagation();
        }}
        style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}
      >
        {hasChildren && (
          <IconChevronRight
            size={16}
            style={{
              transform: expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 150ms',
            }}
          />
        )}
        {!hasChildren && <span style={{ width: 16 }} />}
        {hasChildren ? <IconFolder size={16} /> : <IconFile size={16} />}
        <Text size="sm">{node.label}</Text>
      </Group>
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 480 }} data-testid="tree-select-card">
      <Text fw={500} size="lg" mb="md">Chargeback rules</Text>

      {/* Reference chips */}
      <Group gap="xs" mb="lg">
        <Text size="sm" fw={500}>Reference:</Text>
        <Badge color="gray" variant="light">SHIP</Badge>
        <Badge
          color="green"
          variant="light"
          leftSection={<IconFolder size={12} />}
          data-testid="ref-chip-fin-ops"
        >
          FIN‑OPS (Finance → Operations)
        </Badge>
      </Group>

      {/* Shipping category */}
      <Text size="sm" fw={500} mb={4}>Shipping category</Text>
      <Popover
        opened={openedField === 'shipping'}
        onChange={(o) => setOpenedField(o ? 'shipping' : null)}
        position="bottom-start"
        width={350}
      >
        <Popover.Target>
          <TextInput
            placeholder="Select a category"
            value={shippingCategory ? valueLabels[shippingCategory] || shippingCategory : ''}
            onClick={() => setOpenedField('shipping')}
            readOnly
            rightSection={<IconChevronRight size={16} />}
            data-testid="tree-select-shipping-category"
            mb="md"
          />
        </Popover.Target>
        <Popover.Dropdown>
          <Tree
            data={treeData}
            tree={treeShipping}
            renderNode={createRenderNode(setShippingCategory, () => setOpenedField(null))}
            data-testid="tree-view-shipping"
          />
        </Popover.Dropdown>
      </Popover>

      {/* Billing category - TARGET */}
      <Text size="sm" fw={500} mb={4}>Billing category</Text>
      <Popover
        opened={openedField === 'billing'}
        onChange={(o) => setOpenedField(o ? 'billing' : null)}
        position="bottom-start"
        width={350}
      >
        <Popover.Target>
          <TextInput
            placeholder="Select a category"
            value={billingCategory ? valueLabels[billingCategory] || billingCategory : ''}
            onClick={() => setOpenedField('billing')}
            readOnly
            rightSection={<IconChevronRight size={16} />}
            data-testid="tree-select-billing-category"
          />
        </Popover.Target>
        <Popover.Dropdown>
          <Tree
            data={treeData}
            tree={treeBilling}
            renderNode={createRenderNode(setBillingCategory, () => setOpenedField(null))}
            data-testid="tree-view-billing"
          />
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
