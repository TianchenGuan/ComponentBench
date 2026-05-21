import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific download trigger components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Download file info for tracking downloads
 */
export interface DownloadInfo {
  fileId: string;
  filename: string;
  url: string;
}

/**
 * Create a blob URL for a mock file download
 * In a real app, this would be a server URL
 */
export const createMockBlobUrl = (filename: string, content: string = ''): string => {
  const blob = new Blob([content || `Mock content for ${filename}`], { 
    type: getMimeType(filename) 
  });
  return URL.createObjectURL(blob);
};

/**
 * Get MIME type based on file extension
 */
export const getMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    csv: 'text/csv',
    json: 'application/json',
    xml: 'application/xml',
    txt: 'text/plain',
    zip: 'application/zip',
    png: 'image/png',
    svg: 'image/svg+xml',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    yaml: 'text/yaml',
    sh: 'application/x-sh',
    env: 'text/plain',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
};

/**
 * Helper to trigger a download programmatically
 */
export const triggerDownload = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
