"use client";
// pages/login.js

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { Input, Button, Form } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'tailwindcss/tailwind.css';

// Define the validation schema with Zod
const schema = z.object({
  email: z.string().email('Invalid email address').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long').nonempty('Password is required'),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    // resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (result.error) {
      // Handle error (show notification, etc.)
      alert(result.error);
    } else {
      // Redirect to dashboard or another page
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <Form onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Input
              placeholder="Email"
              {...register('email')}
              className="mb-2"
              size="large"
            />
          </Form.Item>
          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Input.Password
              placeholder="Password"
              {...register('password')}
              className="mb-4"
              size="large"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

