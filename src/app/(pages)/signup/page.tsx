'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/api/auth.api';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password is too short')
      .max(15, 'Password must not exceed 15 characters')
      .matches(/[a-z]/, 'Password must contain lowercase')
      .matches(/[A-Z]/, 'Password must contain uppercase')
      .required('Password is required'),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number')
      .required('Phone number is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data = await registerUser(values);
        if (data.message === 'success') {
          router.push('/login');
        } else {
          setApiError(data.message);
        }
      } catch (err: any) {
        setApiError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50 text-slate-800">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-slate-100">
        <h1 className="mb-6 text-2xl font-black text-center text-slate-900">Create Account</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input
              {...formik.getFieldProps('name')}
              placeholder="Full Name"
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500"
            />
            {formik.touched.name && formik.errors.name && <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.name}</p>}
          </div>

          <div>
            <input
              {...formik.getFieldProps('email')}
              placeholder="Email Address"
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500"
            />
            {formik.touched.email && formik.errors.email && <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.email}</p>}
          </div>

          <div className="relative">
            <input
              {...formik.getFieldProps('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-slate-400 hover:text-emerald-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formik.touched.password && formik.errors.password && <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.password}</p>}
          </div>

          <div className="relative">
            <input
              {...formik.getFieldProps('rePassword')}
              type={showRePassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowRePassword(!showRePassword)}
              className="absolute right-3 top-4 text-slate-400 hover:text-emerald-500"
            >
              {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formik.touched.rePassword && formik.errors.rePassword && <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.rePassword}</p>}
          </div>

          <div>
            <input
              {...formik.getFieldProps('phone')}
              placeholder="Phone Number"
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500"
            />
            {formik.touched.phone && formik.errors.phone && <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.phone}</p>}
          </div>

          {apiError && <p className="p-3 text-sm font-bold text-center text-red-600 border border-red-100 rounded-md bg-red-50">{apiError}</p>}

          <button
            disabled={isLoading}
            type="submit"
            className="flex justify-center w-full py-3 mt-4 font-bold text-white transition-all rounded-lg cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}