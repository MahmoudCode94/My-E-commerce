'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { resetPassword, AuthResponse } from '@/api/auth.api';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ResetPasswordFormValues {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const router = useRouter();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      formik.setFieldValue('email', savedEmail);
    }
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    newPassword: Yup.string()
      .min(6, 'Too short (min 6 characters)')
      .max(15, 'Too long (max 15 characters)')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: { email: '', newPassword: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data: AuthResponse = await resetPassword({
          email: values.email.trim(),
          newPassword: values.newPassword
        });

        if (data.token) {
          toast.success("Password reset successfully!");
          router.push('/login');
        } else {
          setApiError(data.message || 'Failed to reset password');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setApiError(err.message);
        } else {
          setApiError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-xl p-10 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 shadow-inner rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500">
          <Lock size={28} />
        </div>

        <h1 className="mb-2 text-2xl font-black text-center text-slate-900 dark:text-slate-50">Set New Password</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <input
              {...formik.getFieldProps('email')}
              type="email"
              placeholder="Email Address"
              className={`w-full px-5 py-4 text-sm transition-all border rounded-2xl outline-none bg-slate-50 dark:bg-slate-800 dark:text-white
                ${formik.touched.email && formik.errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'}`}
            />
            {formik.touched.email && formik.errors.email && <p className="mt-1.5 ml-2 text-xs font-bold text-red-500">{formik.errors.email}</p>}
          </div>

          <div className="relative">
            <input
              {...formik.getFieldProps('newPassword')}
              type={showPass ? 'text' : 'password'}
              placeholder="New Password"
              className={`w-full px-5 py-4 text-sm transition-all border rounded-2xl outline-none bg-slate-50 dark:bg-slate-800 dark:text-white
                ${formik.touched.newPassword && formik.errors.newPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'}`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-slate-400 hover:text-emerald-500">
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {formik.touched.newPassword && formik.errors.newPassword && <p className="mt-1.5 ml-2 text-xs font-bold text-red-500">{formik.errors.newPassword}</p>}
          </div>

          <div className="relative">
            <input
              {...formik.getFieldProps('confirmPassword')}
              type={showConfirmPass ? 'text' : 'password'}
              placeholder="Confirm New Password"
              className={`w-full px-5 py-4 text-sm transition-all border rounded-2xl outline-none bg-slate-50 dark:bg-slate-800 dark:text-white
                ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'}`}
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-4 text-slate-400 hover:text-emerald-500">
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="mt-1.5 ml-2 text-xs font-bold text-red-500">{formik.errors.confirmPassword}</p>}
          </div>

          {apiError && (
            <div className="p-4 text-sm font-bold text-center text-red-600 border border-red-100 rounded-2xl bg-red-50">
              {apiError}
            </div>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className="flex items-center justify-center w-full py-4 mt-6 font-black text-white transition-all shadow-lg rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 shadow-emerald-100 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}