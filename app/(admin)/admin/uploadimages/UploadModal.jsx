"use client";

import { Modal, Button, Select, Input, message, Col } from "antd";
import { useState, useEffect } from "react";
import MultiImageUploader from "./MultiImageUploader";
import axios from "axios";

const UploadModal = ({ open, onCancel, fetchImages }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    getFolders();
    setSelectedFolder("");
    setNewFolder("");
    setFiles([]);
  }, [open]);


    const getFolders = async () => {
      try {
        const { data } = await axios.get("/api/fileUpload/folders");
        if (data.success) {
          setFolders(data.folders);
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch folders");
      }
    };

  const handleSave = async () => {
    const finalFolder = newFolder.trim() || selectedFolder;

    if (!finalFolder) {
      message.error("Please select or add folder");
      return;
    }

    if (files.length === 0) {
      message.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("folder", finalFolder);
    files.forEach((file) => formData.append("files", file));

    try {
      const { data } = await axios.post("/api/fileUpload/bulk", formData);
      if (data.success) {
        message.success("Uploaded successfully!");
        fetchImages();
        onCancel();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      message.error("Upload failed");
    }
  };

  return (
    <Modal
      title="Bulk Upload Images"
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          style={{ background: "#D6872A", borderColor: "#D6872A" }}
        >
          Upload
        </Button>,
      ]}
    >
      <Col span={24} className="mb-4">
        <label className="block mb-1">Select Existing Folder</label>
        <Select
          value={selectedFolder}
          style={{ width: "100%", marginBottom: 8 }}
          placeholder="Select folder"
          options={folders.map((f) => ({ label: f, value: f }))}
          onChange={(val) => {
            setSelectedFolder(val);
            setNewFolder("");
          }}
        />
        <label className="block mb-1">Or Create New Folder</label>
        <Input
          placeholder="Type new folder name"
          value={newFolder}
          onChange={(e) => {
            setNewFolder(e.target.value);
            if (e.target.value) setSelectedFolder("");
          }}
        />
      </Col>

      <Col span={24}>
        <MultiImageUploader onFilesSelected={setFiles} />
      </Col>
    </Modal>
  );
};

export default UploadModal;
