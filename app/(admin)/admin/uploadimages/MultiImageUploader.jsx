"use client";

import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useCallback, useMemo } from "react";

const { Dragger } = Upload;

const MultiImageUploader = ({ onFilesSelected }) => {
  const handleBeforeUpload = useCallback(
    (file, fileList) => {
      onFilesSelected(fileList);
      return false;
    },
    [onFilesSelected]
  );

  const handleDrop = useCallback(
    (e) => {
      onFilesSelected(Array.from(e.dataTransfer.files));
    },
    [onFilesSelected]
  );

  const uploadProps = useMemo(
    () => ({
      multiple: true,
      beforeUpload: handleBeforeUpload,
      onDrop: handleDrop,
      accept: "image/*",
    }),
    [handleBeforeUpload, handleDrop]
  );

  return (
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag image files to upload</p>
    </Dragger>
  );
};

export default MultiImageUploader;
