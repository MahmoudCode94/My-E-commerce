'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword, AuthResponse } from '@/api/auth.api';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPassword() {
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data: AuthResponse = await forgotPassword(values.email);
        
        if (data.statusMsg === 'success') {
          router.push('/verify-code'); 
        } else {
          setApiError(data.message || 'Something went wrong');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Network error, try again.';
        setApiError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-xl p-10 border border-slate-100 text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-[2rem] bg-emerald-50 text-emerald-600 transition-transform hover:rotate-12">
          <ShieldCheck size={40} />
        </div>
        
        <h1 className="mb-2 text-3xl font-black text-slate-900">Forgot Password?</h1>
        <p className="mb-10 leading-relaxed text-slate-500">
          No worries! Enter your email below to receive a <span className="font-bold text-emerald-600">verification code</span>.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="text-left">
            <div className="relative">
              <input 
                {...formik.getFieldProps('email')} 
                type="email"
                placeholder="Email Address" 
                className={`w-full px-5 py-4 text-sm transition-all border rounded-2xl outline-none bg-slate-50 
                  ${formik.touched.email && formik.errors.email 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-slate-200 focus:border-emerald-500 focus:bg-white shadow-sm'}`} 
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 ml-2 text-xs font-bold tracking-wide text-red-500 uppercase">
                {formik.errors.email}
              </p>
            )}
          </div>

          {apiError && (
            <div className="p-4 text-sm font-bold text-red-600 border-2 border-red-50 rounded-2xl bg-red-50/50 animate-pulse">
              {apiError}
            </div>
          )}

          <button 
            disabled={isLoading} 
            type="submit" 
            className="flex items-center justify-center w-full py-4 font-black text-white transition-all shadow-lg rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 shadow-emerald-200 active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              'Send Reset Code'
            )}
          </button>
        </form>

        <button 
          onClick={() => router.back()}
          className="mt-8 text-sm font-bold transition-colors text-slate-400 hover:text-slate-600"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}