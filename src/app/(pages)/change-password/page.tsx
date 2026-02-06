'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { changeUserPassword, ChangePasswordValues, AuthResponse } from '@/api/auth.api';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ChangePassword() {
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik<ChangePasswordValues>({
    initialValues: { currentPassword: '', password: '', rePassword: '' },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      password: Yup.string().min(6, 'Too short').max(15, 'Too long').required('New password is required'),
      rePassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm your password'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data: AuthResponse = await changeUserPassword(values);
        
        if (data.message === 'success') {
          setSuccessMsg('Password updated successfully! Logging you out...');
          setTimeout(() => {
            Cookies.remove('userToken');
            router.push('/login');
          }, 2000);
        } else {
          setApiError(data.statusMsg || data.message || 'Verification failed');
          setIsLoading(false);
        }
      } catch (error) {
        setApiError('An unexpected error occurred');
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-black text-slate-900">Change Password</h1>
          <p className="text-sm text-slate-500">Secure your account with a new password</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input 
              {...formik.getFieldProps('currentPassword')} 
              type="password" 
              placeholder="Current Password" 
              className={`w-full px-4 py-3 text-sm border rounded-xl outline-none bg-slate-50 transition-all ${formik.touched.currentPassword && formik.errors.currentPassword ? 'border-red-500' : 'border-slate-200 focus:border-emerald-500'}`} 
            />
            {formik.touched.currentPassword && formik.errors.currentPassword && <p className="mt-1 ml-1 text-xs font-bold text-red-500">{formik.errors.currentPassword}</p>}
          </div>

          <div>
            <input 
              {...formik.getFieldProps('password')} 
              type="password" 
              placeholder="New Password" 
              className={`w-full px-4 py-3 text-sm border rounded-xl outline-none bg-slate-50 transition-all ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-200 focus:border-emerald-500'}`} 
            />
            {formik.touched.password && formik.errors.password && <p className="mt-1 ml-1 text-xs font-bold text-red-500">{formik.errors.password}</p>}
          </div>

          <div>
            <input 
              {...formik.getFieldProps('rePassword')} 
              type="password" 
              placeholder="Confirm New Password" 
              className={`w-full px-4 py-3 text-sm border rounded-xl outline-none bg-slate-50 transition-all ${formik.touched.rePassword && formik.errors.rePassword ? 'border-red-500' : 'border-slate-200 focus:border-emerald-500'}`} 
            />
            {formik.touched.rePassword && formik.errors.rePassword && <p className="mt-1 ml-1 text-xs font-bold text-red-500">{formik.errors.rePassword}</p>}
          </div>

          {apiError && <p className="p-3 text-sm font-bold text-red-600 border border-red-100 rounded-xl bg-red-50">{apiError}</p>}
          {successMsg && <p className="p-3 text-sm font-bold border rounded-xl text-emerald-600 bg-emerald-50 border-emerald-100">{successMsg}</p>}

          <button 
            disabled={isLoading} 
            type="submit" 
            className="flex items-center justify-center w-full py-4 font-bold text-white transition-all bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}