import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific file upload button components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * File status for upload components
 */
export type FileStatus = 'uploading' | 'done' | 'error' | 'removed';

/**
 * File item representation for upload lists
 */
export interface FileItem {
  uid: string;
  name: string;
  status: FileStatus;
  url?: string;
  thumbUrl?: string;
  type?: string;
  size?: number;
}

/**
 * Sample file option for in-page picker (virtual file dialog)
 */
export interface SampleFile {
  name: string;
  type: string;
  size?: number;
}

/**
 * Helper to simulate file upload delay
 */
export const simulateUpload = (delayMs: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
};

/**
 * Create a mock file object for testing
 */
export const createMockFile = (name: string, type?: string, size?: number): File => {
  const mimeType = type || getMimeType(name);
  const content = `Mock content for ${name}`;
  const blob = new Blob([content], { type: mimeType });
  const file = new File([blob], name, { type: mimeType });
  if (size) {
    Object.defineProperty(file, 'size', { value: size });
  }
  return file;
};

/**
 * Get MIME type from filename
 */
export const getMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    txt: 'text/plain',
    csv: 'text/csv',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
};

/**
 * Generate unique ID for files
 */
export const generateUid = (): string => {
  return `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
