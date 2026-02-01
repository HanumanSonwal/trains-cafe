"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Spin, message } from "antd";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required") 
    .email("Invalid email address"), 
  password: z
    .string()
    .min(1, "Password is required") 
    .min(6, "Password must be at least 6 characters"), 
});

export default function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
  
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
  
      setLoading(false);
  
      if (result?.error) {
        setError(result.error);
        message.error(result.error); 
      } else {
        message.success("Login successful");
        router.push(`/super-panel/dashboard`);
      }
    } catch (error) {
      setLoading(false);
      setError("An unexpected error occurred.");
      message.error("An unexpected error occurred."); 
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center text-neutral-800 dark:text-neutral-200 h-[100vh]">
      <div className="w-full">
        <img alt="Login" src="/images/loginImg.jpg" className="" />
      </div>

      <div className="flex items-center rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full flex flex-col justify-center items-center gap-6"
        >
          <p className="text-center text-[30px] font-semibold text-[#101828]">
            Sign in
          </p>

          <div className="relative w-[85%]">
            <label htmlFor="email" className="block mb-3 text-base font-medium text-[#101828]">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className={`border text-gray-900 text-base block w-full p-2.5 ${errors.email ? "border-red-500" : "border-[#E0E0E0]"}`}
              placeholder="Enter Email Address"
              {...register("email")}
            />
            {errors.email && (
              <div className="text-red-500 text-xs">{errors.email.message}</div>
            )}
          </div>

          <div className="relative w-[85%]">
            <label htmlFor="password" className="block mb-3 text-base font-medium text-[#101828]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`border text-gray-900 text-base block w-full p-2.5 ${errors.password ? "border-red-500" : "border-[#E0E0E0]"}`}
                placeholder="Enter Password"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute top-[11px] right-5 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs">{errors.password.message}</div>
            )}
          </div>

          <div className="flex justify-between items-center w-[85%]">
            <div className="flex items-center gap-[10px]">
              <input type="checkbox" className="my-0 h-[16px] w-[16px]" />
              <h4 className="text-sm font-normal text-[#101828]">Remember me</h4>
            </div>
            <Link href="/company-user-auth/forgot-password" className="text-sm font-normal text-[#F59E0B]">
              Forgot password?
            </Link>
          </div>

          {loading ? (
            <button className="bg-[#F59E0B] text-base font-medium w-[85%] py-3 flex justify-center items-center text-[#fff]">
              Loading... <Spin className="ml-[10px]" />
            </button>
          ) : (
            <button className="bg-[#F59E0B] text-base font-medium w-[85%] py-3 flex justify-center items-center text-[#fff]" type="submit">
              Sign in
            </button>
          )}

          {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}
