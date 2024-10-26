import React from 'react';
import { Modal, Button, Input, DatePicker, InputNumber, Select } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const couponSchema = z.object({
  title: z.string().nonempty('Please enter the coupon title'),
  code: z.string().nonempty('Please enter the coupon code'),
  startDate: z.date().refine((val) => val instanceof Date, 'Please select a valid start date'),
  endDate: z.date().refine((val) => val instanceof Date, 'Please select a valid end date'),
  minimumAmount: z.number().min(1, 'Minimum amount must be greater than zero'),
  discountType: z.enum(['percentage', 'flat'], 'Please select a discount type'),
  discountValue: z.number().min(1, 'Please enter a valid discount value'),
  status: z.enum(['published', 'draft'], 'Please select a status'),
});

const CouponsForm = ({ open, onCancel, initialValues, fetchCoupons }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: initialValues || {
      title: '',
      code: '',
      startDate: null,
      endDate: null,
      minimumAmount: 0,
      discountType: 'percentage',
      discountValue: 0,
      status: 'published',
    },
  });

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleFormSubmit = async (data) => {
    const payload = {
      title: data.title,
      code: data.code,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      minimumAmount: data.minimumAmount,
      discount: {
        type: data.discountType,
        value: data.discountValue,
      },
      status: data.status,
    };

    try {
      if (initialValues && initialValues._id) {
        await axios.put(`/api/coupon/update/${initialValues._id}`, payload);
      } else {
        await axios.post('/api/coupon/add', payload);
      }
      fetchCoupons();
      reset();
      onCancel();
    } catch (error) {
      console.error('Failed to submit the form:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Edit Coupon' : 'Add Coupon'}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit(handleFormSubmit)}
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          {initialValues ? 'Save' : 'Submit'}
        </Button>,
      ]}
    >
      <form>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Coupon Title</label>
              <Input {...field} />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>
          )}
        />
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Coupon Code</label>
              <Input {...field} />
              {errors.code && <p className="text-red-500">{errors.code.message}</p>}
            </div>
          )}
        />
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Start Date</label>
              <DatePicker {...field} />
              {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
            </div>
          )}
        />
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">End Date</label>
              <DatePicker {...field} />
              {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
            </div>
          )}
        />
        <Controller
          name="minimumAmount"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Minimum Amount</label>
              <InputNumber {...field} min={1} />
              {errors.minimumAmount && <p className="text-red-500">{errors.minimumAmount.message}</p>}
            </div>
          )}
        />
        <Controller
          name="discountType"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Discount Type</label>
              <Select {...field} options={[
                { value: 'percentage', label: 'Percentage' },
                { value: 'flat', label: 'Flat' },
              ]} />
              {errors.discountType && <p className="text-red-500">{errors.discountType.message}</p>}
            </div>
          )}
        />
        <Controller
          name="discountValue"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Discount Value</label>
              <InputNumber {...field} min={1} />
              {errors.discountValue && <p className="text-red-500">{errors.discountValue.message}</p>}
            </div>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Status</label>
              <Select {...field} options={[
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
              ]} />
              {errors.status && <p className="text-red-500">{errors.status.message}</p>}
            </div>
          )}
        />
      </form>
    </Modal>
  );
};

export default CouponsForm;
