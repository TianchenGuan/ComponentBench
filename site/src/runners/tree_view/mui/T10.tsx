'use client';

/**
 * tree_view-mui-T10: Edit label: rename Draft to Draft (archived)
 *
 * Layout: isolated_card centered titled "Editable Outline". Dark theme is enabled and the page uses
 * compact spacing (smaller paddings). Contains a RichTreeView with label editing enabled
 * (isItemEditable=true). Editable items can enter editing mode via double click or by focusing
 * the item and pressing Enter; Enter saves, Esc cancels.
 *
 * Tree structure (expanded by default to show target):
 * • Documents (docs)
 *   – Draft (docs/draft) [TARGET]
 *   – Draft copy (docs/draft-copy) [distractor]
 *   – Final (docs/final)
 *
 * Initial state: nothing is selected; focus is on the tree. No other inputs are present.
 *
 * Success: The label text for node id 'docs/draft' equals exactly "Draft (archived)".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../types';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const initialTreeData: TreeNode[] = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      { id: 'docs/draft', label: 'Draft' },
      { id: 'docs/draft-copy', label: 'Draft copy' },
      { id: 'docs/final', label: 'Final' },
    ],
  },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialTreeData);
  const [expandedItems, setExpandedItems] = useState<string[]>(['docs']);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const successFired = useRef(false);

  // Check for success
  useEffect(() => {
    const findLabel = (nodes: TreeNode[], targetId: string): string | null => {
      for (const node of nodes) {
        if (node.id === targetId) return node.label;
        if (node.children) {
          const found = findLabel(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const draftLabel = findLabel(treeData, 'docs/draft');
    if (!successFired.current && draftLabel === 'Draft (archived)') {
      successFired.current = true;
      onSuccess();
    }
  }, [treeData, onSuccess]);

  const handleDoubleClick = (nodeId: string, currentLabel: string) => {
    setEditingId(nodeId);
    setEditValue(currentLabel);
  };

  const handleEditSave = () => {
    if (!editingId) return;

    const updateLabel = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === editingId) {
          return { ...node, label: editValue.trim() };
        }
        if (node.children) {
          return { ...node, children: updateLabel(node.children) };
        }
        return node;
      });
    };

    setTreeData(updateLabel(treeData));
    setEditingId(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map(node => (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          editingId === node.id ? (
            <TextField
              size="small"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEditSave();
                } else if (e.key === 'Escape') {
                  handleEditCancel();
                }
              }}
              onBlur={handleEditSave}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              sx={{ 
                '& .MuiInputBase-input': { 
                  py: 0.5, 
                  px: 1,
                  fontSize: 'inherit',
                }
              }}
            />
          ) : (
            <Box
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleDoubleClick(node.id, node.label);
              }}
              sx={{ cursor: 'text' }}
            >
              {node.label}
            </Box>
          )
        }
      >
        {node.children && renderTree(node.children)}
      </TreeItem>
    ));
  };

  return (
    <Card sx={{ width: 400 }} data-testid="tree-card">
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>Editable Outline</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Double-click an item to edit. Press Enter to save, Esc to cancel.
        </Typography>
        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
          data-testid="tree-root"
        >
          {renderTree(treeData)}
        </SimpleTreeView>
      </CardContent>
    </Card>
  );
}
