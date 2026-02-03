'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { verifyResetCode } from '@/api/auth.api';
import { Loader2, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyCode() {
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { resetCode: '' },
    validationSchema: Yup.object({
      resetCode: Yup.string().required('Reset code is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data = await verifyResetCode(values.resetCode);
        if (data.status === 'Success') {
          // لو الكود صح بنوديه لأخر مرحلة وهي تغيير الباسوورد
          router.push('/reset-password');
        } else {
          setApiError(data.message || 'Invalid Code');
        }
      } catch (err) {
        setApiError('Network error, try again.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-slate-100 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-600">
          <KeyRound size={32} />
        </div>
        <h1 className="mb-2 text-2xl font-black text-slate-900">Verify Code</h1>
        <p className="mb-8 text-sm text-slate-500">Enter the verification code sent to your email</p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="text-left">
            <input 
              {...formik.getFieldProps('resetCode')} 
              placeholder="Enter 6-digit code" 
              className="w-full px-4 py-3 text-sm border outline-none bg-slate-50 rounded-lg border-slate-200 focus:border-emerald-500 transition-all text-center tracking-[1em] font-bold" 
            />
            {formik.touched.resetCode && formik.errors.resetCode && <p className="mt-2 text-sm font-medium text-red-500">{formik.errors.resetCode}</p>}
          </div>

          {apiError && <p className="p-3 text-sm font-bold text-red-600 border border-red-100 rounded-md bg-red-50">{apiError}</p>}

          <button 
            disabled={isLoading} 
            type="submit" 
            className="flex justify-center w-full py-3 font-bold text-white transition-all rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
}