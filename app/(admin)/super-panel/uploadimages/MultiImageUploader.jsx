"use client";

import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useCallback, useMemo, useState, useEffect } from "react";

const { Dragger } = Upload;

const MultiImageUploader = ({ onFilesSelected, resetTrigger }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (resetTrigger) {
      setFileList([]);
    }
  }, [resetTrigger]);

  const handleBeforeUpload = useCallback(
    (file, fileList) => {
      setFileList(fileList);
      onFilesSelected(fileList);
      return false;
    },
    [onFilesSelected]
  );

  const handleRemove = useCallback(
    (file) => {
      const newList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(newList);
      onFilesSelected(newList);
    },
    [fileList, onFilesSelected]
  );

  const uploadProps = useMemo(
    () => ({
      multiple: true,
      beforeUpload: handleBeforeUpload,
      onRemove: handleRemove,
      fileList,
      accept: "image/*",
    }),
    [handleBeforeUpload, handleRemove, fileList]
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
