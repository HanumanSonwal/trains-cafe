import React from 'react';
import { Modal, Button, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const stationSchema = z.object({
  name: z.string().nonempty('Please enter the station name'),
  code: z.string().nonempty('Please enter the station code'),
  location: z.string().nonempty('Please enter the location'),
  address: z.string().nonempty('Please enter the address'),
});

const StationsForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(stationSchema),
    defaultValues: initialValues || { name: '', code: '', location: '', address: '' },
  });

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset({ name: '', code: '', location: '', address: '' });
  };

  return (
    <Modal 
      title={initialValues ? 'Edit Station' : 'Add Station'} 
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
              <label className="block mb-1">Station Name</label>
              <Input {...field} />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
          )}
        />
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Station Code</label>
              <Input {...field} />
              {errors.code && <p className="text-red-500">{errors.code.message}</p>}
            </div>
          )}
        />
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Location</label>
              <Input {...field} />
              {errors.location && <p className="text-red-500">{errors.location.message}</p>}
            </div>
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Address</label>
              <Input {...field} />
              {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            </div>
          )}
        />
      </form>
    </Modal>
  );
};

export default StationsForm;
