import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Col, message, Upload } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadOutlined } from "@ant-design/icons";

const vendorSchema = z.object({
  title: z.string().nonempty("Please enter the category title"),
  ThumbnailImage: z
    .any()
    .refine((val) => val && val.length > 0, "Please upload an image"),
});

const CategoriesForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialValues || {
      title: "",
      ThumbnailImage: [],
    },
  });

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (initialValues && initialValues.ThumbnailImage) {
      const initialFile = {
        uid: "-1",
        name: "thumbnail",
        status: "done",
        url: initialValues.ThumbnailImage,
      };
      setFileList([initialFile]);
      setValue("ThumbnailImage", [initialFile]);
    }
    reset(initialValues);
  }, [initialValues, reset, setValue]);

  const handleFormSubmit = (data) => {
    const submissionData = {
      ...data,
      ThumbnailImage: data.ThumbnailImage[0]?.url || "",
    };
    onSubmit(submissionData);
    reset({
      title: "",
      ThumbnailImage: [],
    });
    setFileList([]);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setValue("ThumbnailImage", newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={initialValues ? "Edit Category" : "Add Category"}
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit(handleFormSubmit)}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          {initialValues ? "Save" : "Submit"}
        </Button>,
      ]}
    >
      <form>
        <Col span={24} className="mb-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div className="mb-4">
                <label className="block mb-1">Category Title</label>
                <Input {...field} />
                {errors.title && (
                  <p className="text-red-500">{errors.title.message}</p>
                )}
              </div>
            )}
          />
        </Col>

        <Col span={24} className="mb-4">
          <Controller
            name="ThumbnailImage"
            control={control}
            render={({ field }) => (
              <div className="mb-4">
                <label className="block mb-1">Thumbnail Image</label>
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {errors.ThumbnailImage && (
                  <p className="text-red-500">
                    {errors.ThumbnailImage.message}
                  </p>
                )}
              </div>
            )}
          />
        </Col>
      </form>
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default CategoriesForm;
