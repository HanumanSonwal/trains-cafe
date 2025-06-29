import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Row, Select, Col, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import slugify from "slugify";
import FileUploadComponent from "@/app/componants/ImageUpload";
import TextEditor from "@/app/componants/TextEditor";

const blogSchema = z.object({
  title: z.string().nonempty("Please enter the blog title"),
  description: z.string().nonempty("Please enter the blog description"),
  content: z.string().nonempty("Please enter the content"),
  status: z.string().nonempty("Please select a status"),
  metakeyword: z.string().nonempty("Please enter meta keywords"),
  metatitle: z.string().nonempty("Please enter a meta title"),
  metadescription: z.string().nonempty("Please enter a meta description"),
  image: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().nonempty("Please select a category"),
});

const BlogForm = ({ open, onCancel, initialValues = {}, fetchBlogs }) => {
  const [url, setUrl] = useState(initialValues?.image || "");
  const [isReset, setIsReset] = useState(false);
  const { Option } = Select;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      status: "",
      metakeyword: "",
      metatitle: "",
      metadescription: "",
      image: "",
      slug: "",
      category: "",
      ...initialValues,
    },
  });

  useEffect(() => {
    reset(initialValues);
    setUrl(initialValues?.image || "");
    setIsReset(true);
  }, [initialValues, reset]);

  const handleFormSubmit = async (data) => {
    try {
      data.slug = slugify(data.title, { lower: true, strict: true });
      data.image = url;

      if (initialValues?._id) {
        await axios.put(`/api/blog?id=${initialValues._id}`, data);
        message.success("Blog updated successfully");
      } else {
        await axios.post("/api/blog", data);
        message.success("Blog added successfully");
      }

      fetchBlogs();
      reset({});
      setUrl("");
      setIsReset(true);
      onCancel();
    } catch (error) {
      console.error("Failed to submit the form:", error);
      message.error("Failed to save the blog");
    }
  };

  return (
    <Modal
      title={initialValues?._id ? "Edit Blog" : "Add Blog"}
      open={open}
      width={800}
      onCancel={onCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit(handleFormSubmit)}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          {initialValues?._id ? "Save" : "Submit"}
        </Button>,
      ]}
    >
      <form>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Blog Title</label>
                  <Input {...field} />
                  {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Status</label>
                  <Select
                    {...field}
                    placeholder="Select Status"
                    className="w-full"
                  >
                    <Option value="publish">Publish</Option>
                    <Option value="draft">Draft</Option>
                  </Select>
                  {errors.status && (
                    <p className="text-red-500">{errors.status.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Category</label>
                  <Select
                    {...field}
                    placeholder="Select Category"
                    className="w-full"
                  >
                    <Option value="Food">Food</Option>
                    <Option value="Health">Health</Option>
                    <Option value="Travel">Travel</Option>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500">{errors.category.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Thumbnail Image</label>
                  <FileUploadComponent
                    {...field}
                    url={url}
                    isreset={isReset}
                    setUrl={setUrl}
                  />
                </div>
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Description</label>
                  <Input.TextArea {...field} />
                  {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="metakeyword"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Meta Keywords</label>
                  <Input {...field} />
                  {errors.metakeyword && (
                    <p className="text-red-500">{errors.metakeyword.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="metatitle"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Meta Title</label>
                  <Input {...field} />
                  {errors.metatitle && (
                    <p className="text-red-500">{errors.metatitle.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Content</label>
                  <TextEditor
                    previousValue={field.value}
                    updatedValue={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    placeholder="Start typing your content here..."
                    height={200}
                  />
                  {errors.content && (
                    <p className="text-red-500">{errors.content.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="metadescription"
              control={control}
              render={({ field }) => (
                <div>
                  <label>Meta Description</label>
                  <Input.TextArea {...field} rows={3} />
                  {errors.metadescription && (
                    <p className="text-red-500">
                      {errors.metadescription.message}
                    </p>
                  )}
                </div>
              )}
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

export default BlogForm;
