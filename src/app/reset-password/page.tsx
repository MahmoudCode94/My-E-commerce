'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '@/api/auth.api';
import { Loader2, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required to identify your account'),
    newPassword: Yup.string()
      .min(6, 'Too short')
      .max(15, 'Too long')
      .matches(/[A-Z]/, 'Must contain uppercase')
      .matches(/[a-z]/, 'Must contain lowercase')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const formik = useFormik({
    initialValues: { email: '', newPassword: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data = await resetPassword({
          email: values.email,
          newPassword: values.newPassword
        });

        if (data.token) {
          router.push('/login');
        } else {
          setApiError(data.message || 'Failed to reset password');
        }
      } catch (err) {
        setApiError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-slate-100">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-600">
          <Lock size={24} />
        </div>
        <h1 className="mb-2 text-2xl font-black text-center text-slate-900">Set New Password</h1>
        <p className="mb-8 text-sm text-center text-slate-500">Please enter your email and choose a strong new password</p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input 
              {...formik.getFieldProps('email')} 
              placeholder="Confirm your Email" 
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500" 
            />
            {formik.touched.email && formik.errors.email && <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.email}</p>}
          </div>
          <div className="relative">
            <input 
              {...formik.getFieldProps('newPassword')} 
              type={showPass ? 'text' : 'password'} 
              placeholder="New Password" 
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500" 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-emerald-500">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formik.touched.newPassword && formik.errors.newPassword && <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.newPassword}</p>}
          </div>
          <div className="relative">
            <input 
              {...formik.getFieldProps('confirmPassword')} 
              type={showConfirmPass ? 'text' : 'password'} 
              placeholder="Confirm New Password" 
              className="w-full px-4 py-3 text-sm transition-colors border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500" 
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-3 text-slate-400 hover:text-emerald-500">
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="mt-1 ml-1 text-sm font-medium text-red-500">{formik.errors.confirmPassword}</p>}
          </div>

          {apiError && <p className="p-3 text-sm font-bold text-center text-red-600 border border-red-100 rounded-md bg-red-50">{apiError}</p>}

          <button 
            disabled={isLoading} 
            type="submit" 
            className="flex justify-center w-full py-3 mt-4 font-bold text-white transition-all rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}