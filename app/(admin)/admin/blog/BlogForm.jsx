import React from 'react';
import { Modal, Button, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const blogSchema = z.object({
  name: z.string().nonempty('Please enter the blog name'),
  title: z.string().nonempty('Please enter the blog title'),
  description: z.string().nonempty('Please enter the blog description'),
  keywords: z.string().nonempty('Please enter keywords'),
  pageData: z.string().nonempty('Please enter the content'),
  status: z.string().nonempty('Please enter the status'),
});

const BlogForm = ({ open, onCancel, initialValues, fetchBlogs }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: initialValues || {
      name: '',
      title: '',
      description: '',
      keywords: '',
      pageData: '',
      status: '',
    },
  });

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleFormSubmit = async (data) => {
    try {
      if (initialValues && initialValues._id) {
        await axios.put(`/api/blog?id=${initialValues._id}`, data);
      } else {
        await axios.post('/api/blog', data);
      }
      fetchBlogs();
      reset({
        name: '',
        title: '',
        description: '',
        keywords: '',
        pageData: '',
        status: '',
      });
      onCancel();
    } catch (error) {
      console.error("Failed to submit the form:", error);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Edit Blog' : 'Add Blog'}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="submit" type="primary" onClick={handleSubmit(handleFormSubmit)} style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}>
          {initialValues ? 'Save' : 'Submit'}
        </Button>
      ]}
    >
      <form>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Blog Name</label>
              <Input {...field} />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
          )}
        />
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Blog Title</label>
              <Input {...field} />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <Input.TextArea {...field} />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>
          )}
        />
        <Controller
          name="keywords"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Keywords</label>
              <Input {...field} />
              {errors.keywords && <p className="text-red-500">{errors.keywords.message}</p>}
            </div>
          )}
        />
        <Controller
          name="pageData"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Content</label>
              <Input.TextArea {...field} rows={5} />
              {errors.pageData && <p className="text-red-500">{errors.pageData.message}</p>}
            </div>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Status</label>
              <Input {...field} />
              {errors.status && <p className="text-red-500">{errors.status.message}</p>}
            </div>
          )}
        />
      </form>
    </Modal>
  );
};

export default BlogForm;
