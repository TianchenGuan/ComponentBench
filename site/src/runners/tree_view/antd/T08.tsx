'use client';

/**
 * tree_view-antd-T08: Check exactly three finance permissions
 *
 * Layout: form_section titled "Role permissions". The main control in the section is a checkable
 * Ant Design Tree (checkable=true) labeled "Permissions tree". Other unrelated form controls
 * (distractors) appear below (a text field for role name and a disabled Save button).
 *
 * Tree structure:
 * • Finance (parent)
 *   – Invoices (leaf, id=perm/finance/invoices)
 *   – Payroll (leaf, id=perm/finance/payroll)
 *   – Budgets (leaf, id=perm/finance/budgets)
 *   – Tax Forms (leaf, id=perm/finance/tax_forms) [distractor]
 * • Engineering (parent) – Deployments, Incidents
 * • HR (parent) – Benefits, Time Off
 *
 * Initial state: "Tax Forms" is checked by default (to simulate a pre-existing role); all other leaves
 * are unchecked. All parents are expanded by default so all leaves are visible without expanding.
 *
 * Success: Checked leaf ids equal exactly {perm/finance/invoices, perm/finance/payroll, perm/finance/budgets}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Input, Button, Typography } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text, Title } = Typography;

const treeData: TreeDataNode[] = [
  {
    title: 'Finance',
    key: 'perm/finance',
    children: [
      { title: 'Invoices', key: 'perm/finance/invoices', isLeaf: true },
      { title: 'Payroll', key: 'perm/finance/payroll', isLeaf: true },
      { title: 'Budgets', key: 'perm/finance/budgets', isLeaf: true },
      { title: 'Tax Forms', key: 'perm/finance/tax_forms', isLeaf: true },
    ],
  },
  {
    title: 'Engineering',
    key: 'perm/engineering',
    children: [
      { title: 'Deployments', key: 'perm/engineering/deployments', isLeaf: true },
      { title: 'Incidents', key: 'perm/engineering/incidents', isLeaf: true },
    ],
  },
  {
    title: 'HR',
    key: 'perm/hr',
    children: [
      { title: 'Benefits', key: 'perm/hr/benefits', isLeaf: true },
      { title: 'Time Off', key: 'perm/hr/time_off', isLeaf: true },
    ],
  },
];

const targetSet = ['perm/finance/invoices', 'perm/finance/payroll', 'perm/finance/budgets'];

// Get all leaf keys from tree
function getLeafKeys(nodes: TreeDataNode[]): string[] {
  const leaves: string[] = [];
  function traverse(node: TreeDataNode) {
    if (node.isLeaf || !node.children?.length) {
      leaves.push(node.key as string);
    } else {
      node.children?.forEach(traverse);
    }
  }
  nodes.forEach(traverse);
  return leaves;
}

const allLeafKeys = getLeafKeys(treeData);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['perm/finance', 'perm/engineering', 'perm/hr']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['perm/finance/tax_forms']);
  const successFired = useRef(false);

  useEffect(() => {
    // Filter to only leaf keys
    const checkedLeaves = (checkedKeys as string[]).filter(k => allLeafKeys.includes(k));
    
    if (!successFired.current && setsEqual(checkedLeaves, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [checkedKeys, onSuccess]);

  return (
    <Card style={{ width: 500 }} data-testid="tree-card">
      <Title level={4}>Role permissions</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Permissions tree</Text>
        <Tree
          treeData={treeData}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys)}
          checkedKeys={checkedKeys}
          onCheck={(checked) => {
            const keys = Array.isArray(checked) ? checked : checked.checked;
            setCheckedKeys(keys);
          }}
          checkable={true}
          selectable={false}
          data-testid="tree-root"
        />
      </div>
      
      {/* Distractor form fields */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e8e8e8' }}>
        <div style={{ marginBottom: 12 }}>
          <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Role name</Text>
          <Input value="Developer" disabled size="small" style={{ maxWidth: 200 }} />
        </div>
        <Button disabled>Save changes</Button>
      </div>
    </Card>
  );
}
