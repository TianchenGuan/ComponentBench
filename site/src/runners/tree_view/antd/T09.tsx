'use client';

/**
 * tree_view-antd-T09: Drag to reorder items in Company folder
 *
 * Layout: isolated_card centered titled "File Explorer". Single Ant Design Tree configured with
 * draggable=true. The tree shows:
 * • Documents (expanded)
 *   – Company (expanded) [TARGET parent]
 *      * Invoice (leaf, id=docs/company/invoice)
 *      * Meeting notes (leaf, id=docs/company/meeting)
 *      * Tasks list (leaf, id=docs/company/tasks)
 * • Pictures (collapsed)
 *
 * Initial order inside Company is: Invoice, Meeting notes, Tasks list.
 * The goal is to move "Meeting notes" to the bottom so the final order is Invoice, Tasks list, Meeting notes.
 *
 * Success: Within parent 'docs/company', the ordered children ids equal [invoice, tasks, meeting] exactly.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import type { TaskComponentProps } from '../types';
import { arraysEqual } from '../types';

const initialTreeData: TreeDataNode[] = [
  {
    title: 'Documents',
    key: 'docs',
    children: [
      {
        title: 'Company',
        key: 'docs/company',
        children: [
          { title: 'Invoice', key: 'docs/company/invoice', isLeaf: true },
          { title: 'Meeting notes', key: 'docs/company/meeting', isLeaf: true },
          { title: 'Tasks list', key: 'docs/company/tasks', isLeaf: true },
        ],
      },
    ],
  },
  {
    title: 'Pictures',
    key: 'pictures',
    children: [
      { title: 'Vacation', key: 'pictures/vacation', isLeaf: true },
    ],
  },
];

const targetOrder = ['docs/company/invoice', 'docs/company/tasks', 'docs/company/meeting'];

// Deep clone tree data
function cloneTree(data: TreeDataNode[]): TreeDataNode[] {
  return data.map(node => ({
    ...node,
    children: node.children ? cloneTree(node.children) : undefined,
  }));
}

// Get children order of a specific parent
function getChildrenOrder(data: TreeDataNode[], parentKey: string): string[] {
  for (const node of data) {
    if (node.key === parentKey && node.children) {
      return node.children.map(c => c.key as string);
    }
    if (node.children) {
      const found = getChildrenOrder(node.children, parentKey);
      if (found.length > 0) return found;
    }
  }
  return [];
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [treeData, setTreeData] = useState<TreeDataNode[]>(cloneTree(initialTreeData));
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['docs', 'docs/company']);
  const successFired = useRef(false);

  useEffect(() => {
    const currentOrder = getChildrenOrder(treeData, 'docs/company');
    if (!successFired.current && arraysEqual(currentOrder, targetOrder)) {
      successFired.current = true;
      onSuccess();
    }
  }, [treeData, onSuccess]);

  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key as string;
    const dragKey = info.dragNode.key as string;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    const data = cloneTree(treeData);
    let dragObj: TreeDataNode;

    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj!);
      });
    } else if (
      ((info.node as TreeDataNode & { props?: { children?: TreeDataNode[] } }).children || []).length > 0 &&
      (info.node as TreeDataNode & { expanded?: boolean }).expanded &&
      dropPosition === 1
    ) {
      // Drop on the bottom gap
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj!);
      });
    } else {
      let ar: TreeDataNode[] = [];
      let i: number = 0;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj!);
      } else {
        ar.splice(i + 1, 0, dragObj!);
      }
    }

    setTreeData(data);
  };

  return (
    <Card title="File Explorer" style={{ width: 400 }} data-testid="tree-card">
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        draggable
        blockNode
        onDrop={onDrop}
        selectable={false}
        checkable={false}
        data-testid="tree-root"
      />
    </Card>
  );
}
