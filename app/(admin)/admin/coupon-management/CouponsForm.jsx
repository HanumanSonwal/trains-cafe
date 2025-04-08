import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Button,
  Input,
  DatePicker,
  InputNumber,
  Select,
  message,
} from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import dayjs from 'dayjs';

const couponSchema = z.object({
  title: z.string().nonempty('Please enter the coupon title'),
  code: z.string().nonempty('Please enter the coupon code'),
  startDate: z
    .date({ required_error: 'Start date is required' })
    .refine((val) => !isNaN(val.getTime()), 'Please select a valid start date'),
  endDate: z
    .date({ required_error: 'End date is required' })
    .refine((val) => !isNaN(val.getTime()), 'Please select a valid end date')
    .refine((val, ctx) => val >= ctx.parent.startDate, {
      message: 'End date must be after start date',
    }),
  minimumAmount: z.number().min(1, 'Minimum amount must be greater than zero'),
  discount: z.object({
    type: z.enum(['percentage', 'flat'], 'Please select a discount type'),
    value: z.number().min(1, 'Please enter a valid discount value'),
  }),
  status: z.enum(['published', 'draft'], 'Please select a status'),
});

const CouponsForm = ({ open, onCancel, initialValues, fetchCoupons }) => {
  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(
    () => ({
      title: initialValues?.title || '',
      code: initialValues?.code || '',
      startDate: initialValues?.startDate
        ? new Date(initialValues.startDate)
        : null,
      endDate: initialValues?.endDate
        ? new Date(initialValues.endDate)
        : null,
      minimumAmount: initialValues?.minimumAmount || 0,
      discount: initialValues?.discount || { type: 'percentage', value: 0 },
      status: initialValues?.status || 'published',
    }),
    [initialValues]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    };

    try {
      let response;

      if (initialValues?._id) {
        response = await axios.put(
          `/api/coupon/update/${initialValues._id}`,
          payload
        );
      } else {
        response = await axios.post('/api/coupon/add', payload);
      }

      if (response?.data?.success === false) {
        message.warning(response.data.message || 'Something went wrong!');
        return;
      }

      message.success(response?.data?.message || 'Operation successful');
      reset();
      fetchCoupons();
      onCancel();
    } catch (error) {
      console.error('Failed to submit the form:', error);
      message.error(error.response?.data?.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? 'Edit Coupon' : 'Add Coupon'}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit(handleFormSubmit)}
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          {initialValues ? 'Save' : 'Submit'}
        </Button>,
      ]}
    >
 <form>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Controller
      name="title"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block mb-1">Coupon Title</label>
          <Input {...field} placeholder="Enter coupon title" />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
      )}
    />

    <Controller
      name="code"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block mb-1">Coupon Code</label>
          <Input {...field} placeholder="Enter coupon code" />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}
        </div>
      )}
    />

    <Controller
      name="startDate"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block mb-1">Start Date</label>
          <DatePicker
            onChange={(date) => field.onChange(date?.toDate())}
            value={field.value ? dayjs(field.value) : null}
            style={{ width: '100%' }}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
      )}
    />

    <Controller
      name="endDate"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block mb-1">End Date</label>
          <DatePicker
            onChange={(date) => field.onChange(date?.toDate())}
            value={field.value ? dayjs(field.value) : null}
            style={{ width: '100%' }}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message}</p>
          )}
        </div>
      )}
    />

    <Controller
      name="minimumAmount"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block mb-1">Minimum Amount</label>
          <InputNumber
            {...field}
            min={1}
            style={{ width: '100%' }}
            placeholder="E.g. 100"
          />
          {errors.minimumAmount && (
            <p className="text-red-500 text-sm">
              {errors.minimumAmount.message}
            </p>
          )}
        </div>
      )}
    />

    <Controller
      name="discount.type"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block mb-1">Discount Type</label>
          <Select
            {...field}
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat' },
            ]}
            style={{ width: '100%' }}
          />
          {errors.discount?.type && (
            <p className="text-red-500 text-sm">
              {errors.discount.type.message}
            </p>
          )}
        </div>
      )}
    />

    <Controller
      name="discount.value"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block mb-1">Discount Value</label>
          <InputNumber
            {...field}
            min={1}
            style={{ width: '100%' }}
            placeholder="E.g. 10"
          />
          {errors.discount?.value && (
            <p className="text-red-500 text-sm">
              {errors.discount.value.message}
            </p>
          )}
        </div>
      )}
    />

    <Controller
      name="status"
      control={control}
      render={({ field }) => (
        <div>
          <label className="block mb-1">Status</label>
          <Select
            {...field}
            options={[
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ]}
            style={{ width: '100%' }}
          />
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>
      )}
    />
  </div>
</form>

    </Modal>
  );
};

export default CouponsForm;
