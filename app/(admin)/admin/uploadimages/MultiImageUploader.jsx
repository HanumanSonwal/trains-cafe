"use client";

import React, { useState } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const MultiImageUploader = ({ folderName, onUploaded }) => {
  const [fileList, setFileList] = useState([]);

  const handleUpload = async (file) => {
    if (!folderName) {
      message.error("Please select a folder first");
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", `trains-cafe/vendors/${folderName}`);

    try {
      const response = await fetch("/api/fileUpload/local", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success(`Uploaded: ${file.name}`);
        onUploaded(result.url);
      } else {
        message.error(result.message || "Upload failed");
      }
    } catch {
      message.error("Error uploading");
    }
  };

  const props = {
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      handleUpload(file);
      return false; 
    },
    onChange: ({ fileList: newList }) => setFileList(newList),
  };

  return (
    <Dragger {...props} style={{ padding: 20 }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag files to upload</p>
      <p className="ant-upload-hint">
        Supports multiple uploads. Files will be stored in <b>{folderName || '...'}</b>
      </p>
    </Dragger>
  );
};

export default MultiImageUploader;
