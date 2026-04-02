'use client';

/**
 * file_dropzone-antd-T06: Upload verification document in a two-dropzone modal
 *
 * setup_description: A modal dialog is open on page load (modal_flow layout) against a dimmed background (light theme overall).
 * The modal title is "Identity verification" and it contains TWO AntD Upload.Dragger instances stacked vertically:
 * 1) "Profile photo" (accept=image/*, maxCount=1) — currently empty
 * 2) "Verification document" (accept=image/*,.pdf, maxCount=1) — currently empty  ← TARGET
 * Each drop area shows the standard AntD dragger affordance. Clicking a drop area opens an in-page "Sample files" picker.
 * The picker lists 4 files:
 * - id-card.jpg
 * - utility-bill.pdf
 * - avatar-green.png
 * - avatar-blue.png
 * Auto-upload is enabled; after selection, the chosen file appears in that dropzone's upload list with a success indicator.
 * The background page has no other interactables beyond the modal (the modal must remain open; no "Save" is required).
 *
 * Success: Only the dropzone labeled "Verification document" is modified.
 *          The "Verification document" dropzone contains exactly one file: id-card.jpg, with status "uploaded".
 *          The "Profile photo" dropzone remains empty.
 */

import React, { useState, useEffect } from 'react';
import { Upload, Modal, Typography, List, Card } from 'antd';
import { InboxOutlined, FileOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'id-card.jpg', type: 'image/jpeg' },
  { name: 'utility-bill.pdf', type: 'application/pdf' },
  { name: 'avatar-green.png', type: 'image/png' },
  { name: 'avatar-blue.png', type: 'image/png' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [profilePhotoFiles, setProfilePhotoFiles] = useState<UploadFile[]>([]);
  const [verificationDocFiles, setVerificationDocFiles] = useState<UploadFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeDropzone, setActiveDropzone] = useState<'profile' | 'verification' | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      profilePhotoFiles.length === 0 &&
      verificationDocFiles.length === 1 &&
      verificationDocFiles[0].name === 'id-card.jpg' &&
      verificationDocFiles[0].status === 'done'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [profilePhotoFiles, verificationDocFiles, completed, onSuccess]);

  const handleOpenPicker = (dropzone: 'profile' | 'verification') => {
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
    
    const setFiles = activeDropzone === 'profile' ? setProfilePhotoFiles : setVerificationDocFiles;
    
    setFiles([newFile]);
    
    await simulateUpload(300);
    setFiles([{ ...newFile, percent: 50 }]);
    await simulateUpload(300);
    setFiles([{ ...newFile, status: 'done', percent: 100 }]);
    
    setActiveDropzone(null);
  };

  const profilePhotoProps: UploadProps = {
    fileList: profilePhotoFiles,
    multiple: false,
    maxCount: 1,
    accept: 'image/*',
    showUploadList: true,
    onRemove: (file) => {
      setProfilePhotoFiles(prev => prev.filter(f => f.uid !== file.uid));
    },
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  const verificationDocProps: UploadProps = {
    fileList: verificationDocFiles,
    multiple: false,
    maxCount: 1,
    accept: 'image/*,.pdf',
    showUploadList: true,
    onRemove: (file) => {
      setVerificationDocFiles(prev => prev.filter(f => f.uid !== file.uid));
    },
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <>
      <Modal
        title="Identity verification"
        open={true}
        closable={false}
        footer={null}
        width={500}
        maskClosable={false}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 8 }}>Profile photo</Title>
          <div data-testid="dropzone-profile-photo" onClick={() => handleOpenPicker('profile')} style={{ cursor: 'pointer' }}>
            <Dragger
              {...profilePhotoProps}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>
          </div>
        </div>

        <div>
          <Title level={5} style={{ marginBottom: 8 }}>Verification document</Title>
          <div data-testid="dropzone-verification-document" onClick={() => handleOpenPicker('verification')} style={{ cursor: 'pointer' }}>
            <Dragger
              {...verificationDocProps}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>
          </div>
        </div>
      </Modal>

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
                avatar={item.type.startsWith('image/') ? <FileImageOutlined /> : <FileOutlined />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
}
