import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific file list manager components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * File item representation for file list managers
 */
export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  folder?: string;
  status?: string;
  keep?: boolean;
  public?: boolean;
  primary?: boolean;
  archived?: boolean;
  thumbnailUrl?: string;
}

/**
 * Sort configuration for file lists
 */
export interface SortConfig {
  key: 'name' | 'size' | 'type' | 'modified' | null;
  direction: 'asc' | 'desc' | null;
}

/**
 * Helper to format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Get file type icon based on extension
 */
export const getFileTypeIcon = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'pdf':
      return '📄';
    case 'docx':
    case 'doc':
      return '📝';
    case 'xlsx':
    case 'xls':
      return '📊';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return '🖼️';
    case 'txt':
      return '📃';
    case 'zip':
    case 'rar':
      return '📦';
    case 'm4a':
    case 'mp3':
      return '🎵';
    case 'md':
      return '📋';
    default:
      return '📁';
  }
};

/**
 * Sample files for different tasks
 */
export const SAMPLE_FILES: FileItem[] = [
  { id: 'f1', name: 'contract-signed.pdf', type: 'application/pdf', size: 245000 },
  { id: 'f2', name: 'draft-proposal.docx', type: 'application/docx', size: 128000 },
  { id: 'f3', name: 'receipt.png', type: 'image/png', size: 89000 },
  { id: 'f4', name: 'invoice-feb.pdf', type: 'application/pdf', size: 156000 },
  { id: 'f5', name: 'notes.txt', type: 'text/plain', size: 4500 },
];

/**
 * Sample files with 6 items and additional fields
 */
export const SAMPLE_FILES_6: FileItem[] = [
  { id: 'f1', name: 'contract-signed.pdf', type: 'application/pdf', size: 245000, keep: true },
  { id: 'f2', name: 'draft-proposal.docx', type: 'application/docx', size: 128000, keep: false },
  { id: 'f3', name: 'receipt.png', type: 'image/png', size: 89000, keep: true },
  { id: 'f4', name: 'invoice-feb.pdf', type: 'application/pdf', size: 156000, keep: false },
  { id: 'f5', name: 'notes.txt', type: 'text/plain', size: 4500, keep: false },
  { id: 'f6', name: 'summary.pdf', type: 'application/pdf', size: 198000, keep: true },
];

/**
 * Generate random thumbnail colors for image matching tasks
 */
export const generateThumbnailColors = (): string[] => {
  return [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  ];
};
