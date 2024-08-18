import React, { useEffect } from 'react';
import { Modal, Button, Input, Select, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';

const { Option } = Select;

const TextEditor = dynamic(() => import('../../../componants/TextEditor'), { ssr: false });

const vendorSchema = z.object({
  name: z.string().nonempty('Please enter the vendor name'),
  contact: z.string().nonempty('Please enter the contact number'),
  deliveryCharges: z.string().nonempty('Please enter the delivery charges'),
  minOrderValue: z.string().nonempty('Please enter the minimum order value'),
  minOrderTime: z.string().nonempty('Please enter the minimum order time'),
  workingTime: z.string().nonempty('Please enter the working time'),
  weeklyOff: z.string().nonempty('Please select the weekly off day'),
  foodType: z.string().nonempty('Please select the food type'),
  description: z.string().nonempty('Please enter a description'),
  address: z.string().nonempty('Please enter the address'),
});

const VendorsForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialValues || {
      name: '',
      contact: '',
      deliveryCharges: '',
      minOrderValue: '',
      minOrderTime: '',
      workingTime: '',
      weeklyOff: '',
      foodType: '',
      description: '',
      address: '',
    },
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset({
      name: '',
      contact: '',
      deliveryCharges: '',
      minOrderValue: '',
      minOrderTime: '',
      workingTime: '',
      weeklyOff: '',
      foodType: '',
      description: '',
      address: '',
    });
  };

  return (
    <Modal
      title={initialValues ? 'Edit Vendor' : 'Add Vendor'}
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit(handleFormSubmit)}
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          {initialValues ? 'Save' : 'Submit'}
        </Button>
      ]}
    >
      <form>
        <Row gutter={16}>
          <Col span={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Vendor Name</label>
                  <Input {...field} />
                  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Contact No.</label>
                  <Input {...field} />
                  {errors.contact && <p className="text-red-500">{errors.contact.message}</p>}
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Controller
              name="deliveryCharges"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Delivery Charges</label>
                  <Input {...field} />
                  {errors.deliveryCharges && <p className="text-red-500">{errors.deliveryCharges.message}</p>}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Min. Order Value (Rs.)</label>
                  <Input {...field} />
                  {errors.minOrderValue && <p className="text-red-500">{errors.minOrderValue.message}</p>}
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Controller
              name="minOrderTime"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Min. Order Time (Minutes)</label>
                  <Input {...field} />
                  {errors.minOrderTime && <p className="text-red-500">{errors.minOrderTime.message}</p>}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="workingTime"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Working Time</label>
                  <Input {...field} />
                  {errors.workingTime && <p className="text-red-500">{errors.workingTime.message}</p>}
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Controller
              name="weeklyOff"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Weekly Off</label>
                  <Select {...field} style={{ width: '100%' }}>
                    <Option value="Monday">Monday</Option>
                    <Option value="Tuesday">Tuesday</Option>
                    <Option value="Wednesday">Wednesday</Option>
                    <Option value="Thursday">Thursday</Option>
                    <Option value="Friday">Friday</Option>
                    <Option value="Saturday">Saturday</Option>
                    <Option value="Sunday">Sunday</Option>
                  </Select>
                  {errors.weeklyOff && <p className="text-red-500">{errors.weeklyOff.message}</p>}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="foodType"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Food Type</label>
                  <Select {...field} style={{ width: '100%' }}>
                    <Option value="Veg & Non-Veg">Veg & Non-Veg</Option>
                    <Option value="Veg">Veg</Option>
                    <Option value="Non-Veg">Non-Veg</Option>
                  </Select>
                  {errors.foodType && <p className="text-red-500">{errors.foodType.message}</p>}
                </div>
              )}
            />
          </Col>
        </Row>
     
          <Col >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="mb-2">
                  <label className="block mb-1">Description</label>
                  <TextEditor
                    previousValue={field.value}
                    updatedValue={(content) => setValue('description', content)}
                    height={200}
                  />
                  {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>
              )}
            />
          </Col>
          <Col >
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Address</label>
                  <TextEditor
                    previousValue={field.value}
                    updatedValue={(content) => setValue('address', content)}
                    height={200}
                  />
                  {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                </div>
              )}
            />
          </Col>
       
      </form>
    </Modal>
  );
};

export default VendorsForm;
