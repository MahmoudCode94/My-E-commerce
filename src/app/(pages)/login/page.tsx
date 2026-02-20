'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/api/auth.api';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { setCookie } from 'cookies-next';

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data = await loginUser(values);
        if (data.message === 'success' && data.token) {
          setCookie('userToken', data.token, { maxAge: 7 * 24 * 60 * 60, secure: true });

          window.dispatchEvent(new Event("userLogin"));
          router.push('/');
          router.refresh();
        } else {
          setApiError(data.message);
        }
      } catch (err: any) {
        setApiError(err.message || 'Authentication failed. Check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-slate-100 dark:border-slate-800">
        <h1 className="mb-2 text-2xl font-black text-center text-slate-900 dark:text-slate-50">Welcome Back</h1>
        <p className="mb-8 text-sm text-center text-slate-500 dark:text-slate-400">Please enter your details to sign in</p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input
              {...formik.getFieldProps('email')}
              placeholder="Email Address"
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white focus:border-emerald-500"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...formik.getFieldProps('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-emerald-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.password}</p>
            )}
          </div>

          <div className="flex justify-end mt-[-10px]">
            <Link
              href="/forgot-password"
              className="text-[.7rem] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {apiError && (
            <p className="p-3 text-sm font-bold text-center text-red-600 border border-red-100 rounded-md bg-red-50">
              {apiError}
            </p>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className="flex justify-center w-full py-3 mt-4 font-bold text-white transition-all rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
          </button>

          <p className="text-sm text-center text-slate-600 dark:text-slate-400">
            Don&apos;t have an account? <Link href="/signup" className="font-bold text-emerald-600 dark:text-emerald-500 hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}