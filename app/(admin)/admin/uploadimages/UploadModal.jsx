"use client";

import { Modal, Button, Select, Input, message, Col } from "antd";
import { useState, useCallback, useMemo, useEffect } from "react";
import MultiImageUploader from "./MultiImageUploader";

const UploadModal = ({
  open,
  onCancel,
  fetchImages,
  fetchFolders,
  folders,
  loadingFolders,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedFolder("");
      setNewFolder("");
      setCreateNew(false);
      setFiles([]);
    }
  }, [open]);

  const handleSave = useCallback(async () => {
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
      setUploading(true);
      message.loading({ content: "Uploading...", key: "uploading" });

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", `trains-cafe/${finalFolder}`);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData, cache: "no-store" }
        );

        const result = await res.json();
        if (!result.secure_url) {
          throw new Error(result.error?.message || "Upload failed");
        }
      }

      message.success({ content: "All images uploaded!", key: "uploading" });

      fetchImages();
      fetchFolders();

      setFiles([]);
      setSelectedFolder("");
      setNewFolder("");
      setCreateNew(false);

      onCancel();
    } catch (err) {
      console.error(err);
      message.error({
        content: `Upload failed: ${err.message}`,
        key: "uploading",
      });
    } finally {
      setUploading(false);
    }
  }, [
    createNew,
    newFolder,
    selectedFolder,
    files,
    fetchImages,
    fetchFolders,
    onCancel,
  ]);

  const folderOptions = useMemo(
    () => folders.map((f) => ({ label: f, value: f })),
    [folders]
  );

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
          loading={uploading}
          onClick={handleSave}
          style={{ background: "#D6872A", borderColor: "#D6872A" }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>,
      ]}
    >
      <Col span={24} className="mb-4">
        {!createNew ? (
          <>
            <label className="block mb-1">Select Existing Folder</label>
            <Select
              showSearch
              loading={loadingFolders}
              value={selectedFolder}
              style={{ width: "100%", marginBottom: 8 }}
              placeholder="Select folder"
              options={folderOptions}
              onChange={setSelectedFolder}
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
            <Button onClick={() => setCreateNew(true)}>
              + Create New Folder
            </Button>
          </>
        ) : (
          <>
            <label className="block mb-1">Create New Folder</label>
            <Input
              placeholder="Type new folder name"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <Button onClick={() => setCreateNew(false)}>
              ← Back to Select Existing
            </Button>
          </>
        )}
      </Col>

      <Col span={24}>
        <MultiImageUploader
          onFilesSelected={setFiles}
          resetTrigger={files.length === 0}
        />
      </Col>
    </Modal>
  );
};

export default UploadModal;
