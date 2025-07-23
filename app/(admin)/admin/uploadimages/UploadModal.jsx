"use client";

import { Modal, Button, Select, Input, message, Col } from "antd";
import { useState, useEffect } from "react";
import MultiImageUploader from "./MultiImageUploader";
import axios from "axios";

const UploadModal = ({ open, onCancel, fetchImages, fetchFolders }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (open) {
      getFolders();
      setSelectedFolder("");
      setNewFolder("");
      setCreateNew(false);
      setFiles([]);
    }
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
    const finalFolder = createNew ? newFolder.trim() : selectedFolder;

    if (!finalFolder) {
      message.error("Please select or create a folder first");
      return;
    }

    if (files.length === 0) {
      message.error("Please select at least one image");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      message.error("Cloudinary env config missing");
      return;
    }

    try {
      message.loading({ content: "Uploading...", key: "uploading" });

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", `trains-cafe/${finalFolder}`);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await res.json();

        if (!result.secure_url) {
          throw new Error(result.error?.message || "Upload failed");
        }
      }

      message.success({ content: "All images uploaded!", key: "uploading" });
      fetchImages();

      if (createNew) {
        await fetchFolders();
      }

      onCancel();
    } catch (err) {
      console.error(err);
      message.error({ content: `Upload failed: ${err.message}`, key: "uploading" });
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

        {/* ✅ Existing Folder Selector */}
        {!createNew && (
          <>
            <label className="block mb-1">Select Existing Folder</label>
            <Select
              value={selectedFolder}
              style={{ width: "100%", marginBottom: 8 }}
              placeholder="Select folder"
              options={folders.map((f) => ({ label: f, value: f }))}
              onChange={(val) => {
                setSelectedFolder(val);
              }}
            />
            <Button
              type="link"
              onClick={() => {
                setCreateNew(true);
                setSelectedFolder("");
              }}
            >
              + Create New Folder
            </Button>
          </>
        )}

        {/* ✅ New Folder Input */}
        {createNew && (
          <>
            <label className="block mb-1">Create New Folder</label>
            <Input
              placeholder="Type new folder name"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <Button
              type="link"
              onClick={() => {
                setCreateNew(false);
                setNewFolder("");
              }}
            >
              ← Back to Select Existing
            </Button>
          </>
        )}
      </Col>

      <Col span={24}>
        <MultiImageUploader onFilesSelected={setFiles} />
      </Col>
    </Modal>
  );
};

export default UploadModal;
