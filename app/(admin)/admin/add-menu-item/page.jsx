"use client";
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message, Select, Radio, Row, Col, Image } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { MenuItemSchema } from '@/app/validation-schema/MenuItemSchema';

const { Option } = Select;
const { Dragger } = Upload;

const MenuItemForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(MenuItemSchema),
    defaultValues: initialValues || {},
  });
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (initialValues) {
      Object.keys(initialValues).forEach(key => setValue(key, initialValues[key]));
      if (initialValues.image) {
        setFileList([{ url: initialValues.image, name: 'uploaded_image' }]);
      }
    }
  }, [initialValues, setValue]);

  const handleFormSubmit = (values) => {
    if (fileList.length === 0) {
      message.error('Please upload an image');
      return;
    }

    const imageUrl = fileList[0].thumbUrl || fileList[0].url;

    const newData = {
      ...values,
      image: imageUrl,
      status: initialValues ? initialValues.status : 'Pending',
    };

    onSubmit(newData);
    setFileList([]);
    reset();
    onCancel();
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
   
    <Modal
   
      open={open}
      width={1000}
      // title={initialValues ? 'Edit Menu Item' : 'Add Menu Item'}
      onCancel={onCancel}
      // onOk={handleSubmit(handleFormSubmit)}
    
           footer={[
       
       <Button key="submit" type="primary" onClick={handleSubmit(handleFormSubmit)} style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}>
     {initialValues ? 'Save' : 'Submit'} 
       </Button>
     ]}
   >
     
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#6F4D27' }}>{initialValues ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
        <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Item Name">
                <Controller
                  name="itemName"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.itemName && <p>{errors.itemName.message}</p>}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Select Category">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <Option value="category1">Category 1</Option>
                      <Option value="category2">Category 2</Option>
                      <Option value="category3">Category 3</Option>
                    </Select>
                  )}
                />
                {errors.category && <p>{errors.category.message}</p>}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Select Vendor">
                <Controller
                  name="vendor"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <Option value="vendor1">Vendor 1</Option>
                      <Option value="vendor2">Vendor 2</Option>
                      <Option value="vendor3">Vendor 3</Option>
                    </Select>
                  )}
                />
                {errors.vendor && <p>{errors.vendor.message}</p>}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Food Type">
                <Controller
                  name="foodType"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group {...field}>
                      <Radio value="Veg">Veg</Radio>
                      <Radio value="Non-Veg">Non-Veg</Radio>
                    </Radio.Group>
                  )}
                />
                {errors.foodType && <p>{errors.foodType.message}</p>}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Price">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => <Input type="number" {...field} />}
                />
                {errors.price && <p>{errors.price.message}</p>}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Discount (%)">
                <Controller
                  name="discount"
                  control={control}
                  render={({ field }) => <Input type="number" {...field} />}
                />
                {errors.discount && <p>{errors.discount.message}</p>}
              </Form.Item>
            </Col>
          </Row>
         
            <Col >
              <Form.Item label="Image">
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <Dragger
                      {...field}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleChange}
                      onPreview={handlePreview}
                      beforeUpload={() => false} // Prevent automatic upload
                    >
                      {fileList.length >= 1 ? null : (
                        <>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">Click or drag file to this area to upload</p>
                          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                        </>
                      )}
                    </Dragger>
                  )}
                />
                {errors.image && <p>{errors.image.message}</p>}
              </Form.Item>
            </Col>
            <Col >
              <Form.Item label="Description">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Input.TextArea rows={4} {...field} />}
                />
                {errors.description && <p>{errors.description.message}</p>}
              </Form.Item>
            </Col>
          
          {/* <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item> */}
        </Form>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: 'none',
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
            }}
            src={previewImage}
          />
        )}
   
    </Modal>
  );
};

export default MenuItemForm;



// "use client";
// import React from 'react';
// import { Modal, Form, Input, Upload, Button, Select, Radio } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { MenuItemSchema } from '@/app/validation-schema/MenuItemSchema';

// const { Option } = Select;

// const MenuItemForm = ({ open, onCancel, onSubmit, initialValues }) => {
//   const { control, handleSubmit, reset, formState: { errors } } = useForm({
//     resolver: zodResolver(MenuItemSchema),
//     defaultValues: initialValues,
//   });

//   const handleOk = () => {
//     handleSubmit((values) => {
//       onSubmit(values);
//       reset();
//     })();
//   };

//   return (
//     <Modal
//       open={open}
//       title={initialValues ? 'Edit Menu Item' : 'Add Menu Item'}
//       onCancel={onCancel}
//       onOk={handleOk}
//     >
//       <Form layout="vertical">
//         <Form.Item
//           label="Item Name"
//           validateStatus={errors.itemName ? 'error' : ''}
//           help={errors.itemName ? errors.itemName.message : ''}
//         >
//           <Controller
//             name="itemName"
//             control={control}
//             render={({ field }) => <Input {...field} />}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Image"
//           validateStatus={errors.image ? 'error' : ''}
//           help={errors.image ? errors.image.message : ''}
//         >
//           <Controller
//             name="image"
//             control={control}
//             render={({ field }) => (
//               <Upload
//                 {...field}
//                 listType="picture"
//                 maxCount={1}
//                 beforeUpload={() => false} // Prevent automatic upload
//               >
//                 <Button icon={<UploadOutlined />}>Click to upload</Button>
//               </Upload>
//             )}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Category"
//           validateStatus={errors.category ? 'error' : ''}
//           help={errors.category ? errors.category.message : ''}
//         >
//           <Controller
//             name="category"
//             control={control}
//             render={({ field }) => (
//               <Select {...field}>
//                 <Option value="category1">Category 1</Option>
//                 <Option value="category2">Category 2</Option>
//                 <Option value="category3">Category 3</Option>
//               </Select>
//             )}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Vendor"
//           validateStatus={errors.vendor ? 'error' : ''}
//           help={errors.vendor ? errors.vendor.message : ''}
//         >
//           <Controller
//             name="vendor"
//             control={control}
//             render={({ field }) => (
//               <Select {...field}>
//                 <Option value="vendor1">Vendor 1</Option>
//                 <Option value="vendor2">Vendor 2</Option>
//                 <Option value="vendor3">Vendor 3</Option>
//               </Select>
//             )}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Food Type"
//           validateStatus={errors.foodType ? 'error' : ''}
//           help={errors.foodType ? errors.foodType.message : ''}
//         >
//           <Controller
//             name="foodType"
//             control={control}
//             render={({ field }) => (
//               <Radio.Group {...field}>
//                 <Radio value="Veg">Veg</Radio>
//                 <Radio value="Non-Veg">Non-Veg</Radio>
//               </Radio.Group>
//             )}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Price"
//           validateStatus={errors.price ? 'error' : ''}
//           help={errors.price ? errors.price.message : ''}
//         >
//           <Controller
//             name="price"
//             control={control}
//             render={({ field }) => <Input type="number" {...field} />}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Discount"
//           validateStatus={errors.discount ? 'error' : ''}
//           help={errors.discount ? errors.discount.message : ''}
//         >
//           <Controller
//             name="discount"
//             control={control}
//             render={({ field }) => <Input type="number" {...field} />}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Description"
//           validateStatus={errors.description ? 'error' : ''}
//           help={errors.description ? errors.description.message : ''}
//         >
//           <Controller
//             name="description"
//             control={control}
//             render={({ field }) => <Input.TextArea rows={4} {...field} />}
//           />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default MenuItemForm;
