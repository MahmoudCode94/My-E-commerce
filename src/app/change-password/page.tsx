'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { changeUserPassword } from '@/api/auth.api';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { currentPassword: '', password: '', rePassword: '' },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      password: Yup.string().min(6, 'Too short').max(15, 'Too long').required('New password is required'),
      rePassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm your password'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      const data = await changeUserPassword(values);
      
      if (data.message === 'success') {
        setSuccessMsg('Password updated successfully! Logging you out...');
        setTimeout(() => {
          localStorage.removeItem('userToken');
          router.push('/login');
        }, 2000);
      } else {
        setApiError(data.message || 'Verification failed');
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-slate-100">
        <h1 className="mb-6 text-2xl font-black text-center text-slate-900">Change Password</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input {...formik.getFieldProps('currentPassword')} type="password" placeholder="Current Password" className="w-full px-4 py-3 text-sm border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500" />
          {formik.touched.currentPassword && formik.errors.currentPassword && <p className="text-xs font-bold text-red-500">{formik.errors.currentPassword}</p>}

          <input {...formik.getFieldProps('password')} type="password" placeholder="New Password" className="w-full px-4 py-3 text-sm border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500" />
          {formik.touched.password && formik.errors.password && <p className="text-xs font-bold text-red-500">{formik.errors.password}</p>}

          <input {...formik.getFieldProps('rePassword')} type="password" placeholder="Confirm New Password" className="w-full px-4 py-3 text-sm border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500" />
          {formik.touched.rePassword && formik.errors.rePassword && <p className="text-xs font-bold text-red-500">{formik.errors.rePassword}</p>}

          {apiError && <p className="p-3 text-sm font-bold text-red-600 border border-red-100 rounded-md bg-red-50">{apiError}</p>}
          {successMsg && <p className="p-3 text-sm font-bold border rounded-md text-emerald-600 bg-emerald-50 border-emerald-100">{successMsg}</p>}

          <button disabled={isLoading} type="submit" className="flex justify-center w-full py-3 font-bold text-white rounded-lg bg-emerald-600 hover:bg-emerald-700">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}