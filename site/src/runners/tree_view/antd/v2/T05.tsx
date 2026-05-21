'use client';

/**
 * tree_view-antd-v2-T05: Company folder reorder — drag Escalations to top and save order
 *
 * Inline surface, light theme. AntD Tree draggable. Tree: Documents → Company →
 * {Overview.md, Meeting notes.md, Tasks.md, Escalations.md}. Archive (collapsed).
 * Documents + Company already expanded. Panel footer: "Discard" and "Save order".
 * Success: Company children order = [escalations, overview, meeting_notes, tasks], "Save order" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Button, Input, Typography, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../../types';
import { arraysEqual } from '../../types';

const { Text, Title } = Typography;

const initialTreeData: TreeDataNode[] = [
  {
    title: 'Documents',
    key: 'documents',
    children: [
      {
        title: 'Company',
        key: 'documents/company',
        children: [
          { title: 'Overview.md', key: 'documents/company/overview', isLeaf: true },
          { title: 'Meeting notes.md', key: 'documents/company/meeting_notes', isLeaf: true },
          { title: 'Tasks.md', key: 'documents/company/tasks', isLeaf: true },
          { title: 'Escalations.md', key: 'documents/company/escalations', isLeaf: true },
        ],
      },
    ],
  },
  { title: 'Archive', key: 'archive', isLeaf: true },
];

const TARGET_ORDER = [
  'documents/company/escalations',
  'documents/company/overview',
  'documents/company/meeting_notes',
  'documents/company/tasks',
];

function findChildKeys(nodes: TreeDataNode[], parentKey: string): string[] {
  for (const n of nodes) {
    if (n.key === parentKey) return (n.children || []).map((c) => c.key as string);
    if (n.children) {
      const result = findChildKeys(n.children, parentKey);
      if (result.length) return result;
    }
  }
  return [];
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [treeData, setTreeData] = useState<TreeDataNode[]>(initialTreeData);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['documents', 'documents/company']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const companyChildren = findChildKeys(treeData, 'documents/company');
    if (committed && arraysEqual(companyChildren, TARGET_ORDER)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, treeData, onSuccess]);

  const onDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (item: TreeDataNode, index: number, arr: TreeDataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) return callback(data[i], i, data);
        if (data[i].children) loop(data[i].children!, key, callback);
      }
    };

    const data = JSON.parse(JSON.stringify(treeData));
    let dragObj: TreeDataNode | undefined;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (!dragObj) return;

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj!);
      });
    } else if (dropPosition === -1) {
      loop(data, dropKey, (_item, index, arr) => {
        arr.splice(index, 0, dragObj!);
      });
    } else {
      loop(data, dropKey, (_item, index, arr) => {
        arr.splice(index + 1, 0, dragObj!);
      });
    }
    setTreeData(data);
    setCommitted(false);
  };

  const handleSave = () => setCommitted(true);

  return (
    <div style={{ padding: 16, maxWidth: 650, display: 'flex', gap: 16 }}>
      <Card title="Runbook files" size="small" style={{ flex: 1 }}>
        <Tree
          treeData={treeData}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys)}
          draggable
          onDrop={onDrop}
          selectable
          data-testid="tree-root"
        />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button size="small" onClick={() => { setTreeData(initialTreeData); setCommitted(false); }}>Discard</Button>
          <Button type="primary" size="small" onClick={handleSave}>Save order</Button>
        </div>
      </Card>
      <div style={{ width: 200 }}>
        <Card size="small" style={{ marginBottom: 12 }}>
          <Text type="secondary">Preview</Text>
          <div style={{ height: 60, background: '#fafafa', marginTop: 8, borderRadius: 4 }} />
        </Card>
        <Input prefix={<SearchOutlined />} placeholder="Search..." size="small" disabled />
      </div>
    </div>
  );
}
