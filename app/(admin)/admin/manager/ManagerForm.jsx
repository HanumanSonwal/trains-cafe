import React from 'react';
import { Modal, Button, Input, Select } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';


const userSchema = z.object({
  name: z.string().nonempty('Please enter your name'),
  mobile: z.string().nonempty('Please enter your mobile number'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['admin', 'subadmin']),
});

const RegistrationForm = ({ open, onCancel, fetchUsers, initialValues }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: initialValues || { name: '', mobile: '', email: '', password: '', role: 'subadmin' },
  });

  const handleFormSubmit = async (data) => {
    try {
      if (initialValues && initialValues._id) {

        await axios.put(`/api/user/edit/${initialValues._id}`, data);
      } else {
     
        await axios.post('/api/user/register', data);
      }
      fetchUsers();
      reset();
      onCancel(); 
    } catch (error) {
      console.error("Failed to submit the form:", error);
    }
  };

  return (
    <Modal
      title={initialValues && initialValues._id ? "Edit User" : "Register User"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit(handleFormSubmit)}
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          {initialValues && initialValues._id ? "Update" : "Register"}
        </Button>,
      ]}
    >
      <form>
       
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <Input {...field} />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
          )}
        />
  
        <Controller
          name="mobile"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Mobile Number</label>
              <Input {...field} />
              {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
            </div>
          )}
        />
        
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <Input {...field} />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
          )}
        />
      
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <Input.Password {...field} />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
          )}
        />
      
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <label className="block mb-1">Role</label>
              <Select {...field} defaultValue={initialValues?.role || 'subadmin'}>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="subadmin">Subadmin</Select.Option>
              </Select>
              {errors.role && <p className="text-red-500">{errors.role.message}</p>}
            </div>
          )}
        />
      </form>
    </Modal>
  );
};

export default RegistrationForm;
