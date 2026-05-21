'use client';

/**
 * file_dropzone-antd-T10: Cancel a removal confirmation so the file stays attached
 *
 * setup_description: The page is a light-theme form section titled "Contract submission" (comfortable spacing).
 * Two AntD Upload.Dragger instances are shown one after another:
 * - "Signed contract"  ← TARGET instance
 * - "Appendix (optional)"
 * Initial state:
 * - The "Signed contract" upload list already contains contract-signed.pdf (status: uploaded).
 * - The "Appendix (optional)" list is empty.
 * In the "Signed contract" upload list, clicking the remove (×) icon opens an AntD Popconfirm anchored to the list item.
 * The Popconfirm text reads "Remove this file?" with two buttons: "Remove" and "Cancel".
 * Clicking "Cancel" closes the popover and keeps the file in place.
 * No other form controls are required for success; the only meaningful interaction is canceling the removal confirmation.
 *
 * Success: A remove confirmation for contract-signed.pdf in the "Signed contract" instance was opened and cancelled (Cancel clicked at least once).
 *          The "Signed contract" dropzone still contains contract-signed.pdf with status "uploaded".
 *          The "Appendix (optional)" dropzone remains empty.
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List, Popconfirm } from 'antd';
import { InboxOutlined, FileOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'contract-signed.pdf', type: 'application/pdf' },
  { name: 'contract-draft.pdf', type: 'application/pdf' },
  { name: 'appendix-a.pdf', type: 'application/pdf' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [signedContractFiles, setSignedContractFiles] = useState<UploadFile[]>([
    {
      uid: 'initial-contract',
      name: 'contract-signed.pdf',
      status: 'done',
      percent: 100,
    },
  ]);
  const [appendixFiles, setAppendixFiles] = useState<UploadFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeDropzone, setActiveDropzone] = useState<'signed' | 'appendix' | null>(null);
  const [completed, setCompleted] = useState(false);
  const [cancelClicked, setCancelClicked] = useState(false);

  // Initialize event counter on window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as typeof window & { __cb_events?: Record<string, number> }).__cb_events = 
        (window as typeof window & { __cb_events?: Record<string, number> }).__cb_events || {};
      (window as typeof window & { __cb_events: Record<string, number> }).__cb_events.remove_confirmation_cancelled = 0;
    }
  }, []);

  useEffect(() => {
    if (completed) return;
    
    // Success requires: cancel was clicked AND files remain in correct state
    if (
      cancelClicked &&
      signedContractFiles.length === 1 &&
      signedContractFiles[0].name === 'contract-signed.pdf' &&
      signedContractFiles[0].status === 'done' &&
      appendixFiles.length === 0
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [signedContractFiles, appendixFiles, cancelClicked, completed, onSuccess]);

  const handleOpenPicker = (dropzone: 'signed' | 'appendix') => {
    setActiveDropzone(dropzone);
    setPickerOpen(true);
  };

  const handleSelectFile = async (sample: SampleFile) => {
    setPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
      percent: 0,
    };
    
    const setFiles = activeDropzone === 'signed' ? setSignedContractFiles : setAppendixFiles;
    
    setFiles(prev => [...prev, newFile]);
    
    await simulateUpload(300);
    setFiles(prev => prev.map(f => f.uid === newFile.uid ? { ...f, percent: 50 } : f));
    await simulateUpload(300);
    setFiles(prev => prev.map(f => f.uid === newFile.uid ? { ...f, status: 'done' as const, percent: 100 } : f));
    
    setActiveDropzone(null);
  };

  const handleCancelRemove = () => {
    setCancelClicked(true);
    if (typeof window !== 'undefined') {
      (window as typeof window & { __cb_events: Record<string, number> }).__cb_events.remove_confirmation_cancelled++;
    }
  };

  const handleConfirmRemove = (file: UploadFile) => {
    setSignedContractFiles(prev => prev.filter(f => f.uid !== file.uid));
  };

  // Custom file list rendering with Popconfirm
  const renderFileList = (files: UploadFile[], isSignedContract: boolean) => {
    if (files.length === 0) return null;
    
    return (
      <div style={{ marginTop: 8 }}>
        {files.map(file => (
          <div
            key={file.uid}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: '#fafafa',
              borderRadius: 4,
              marginBottom: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileOutlined />
              <Text>{file.name}</Text>
              {file.status === 'done' && (
                <Text type="success" style={{ fontSize: 12 }}>Uploaded</Text>
              )}
            </div>
            
            {isSignedContract ? (
              <Popconfirm
                title="Remove this file?"
                onConfirm={() => handleConfirmRemove(file)}
                onCancel={handleCancelRemove}
                okText="Remove"
                cancelText="Cancel"
              >
                <DeleteOutlined style={{ cursor: 'pointer', color: '#999' }} />
              </Popconfirm>
            ) : (
              <DeleteOutlined 
                style={{ cursor: 'pointer', color: '#999' }}
                onClick={() => setAppendixFiles(prev => prev.filter(f => f.uid !== file.uid))}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const signedContractProps: UploadProps = {
    multiple: false,
    showUploadList: false,  // We render custom list
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  const appendixProps: UploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <Card title="Contract submission" style={{ width: 500 }}>
      {/* Signed contract - TARGET */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5} style={{ marginBottom: 8 }}>Signed contract</Title>
        <div data-testid="dropzone-signed-contract" onClick={() => handleOpenPicker('signed')} style={{ cursor: 'pointer' }}>
          <Dragger
            {...signedContractProps}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Dragger>
          {renderFileList(signedContractFiles, true)}
        </div>
      </div>

      {/* Appendix */}
      <div>
        <Title level={5} style={{ marginBottom: 8 }}>Appendix (optional)</Title>
        <div data-testid="dropzone-appendix" onClick={() => handleOpenPicker('appendix')} style={{ cursor: 'pointer' }}>
          <Dragger
            {...appendixProps}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Dragger>
          {renderFileList(appendixFiles, false)}
        </div>
      </div>

      <Modal
        title="Sample files"
        open={pickerOpen}
        onCancel={() => {
          setPickerOpen(false);
          setActiveDropzone(null);
        }}
        footer={null}
        width={350}
      >
        <List
          dataSource={SAMPLE_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectFile(item)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={<FileOutlined />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
