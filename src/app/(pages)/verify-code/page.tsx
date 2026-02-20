'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { verifyResetCode, AuthResponse } from '@/api/auth.api';
import { Loader2, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface VerifyCodeFormValues {
  resetCode: string;
}

export default function VerifyCode() {
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik<VerifyCodeFormValues>({
    initialValues: { resetCode: '' },
    validationSchema: Yup.object({
      resetCode: Yup.string()
        .required('Verification code is required')
        .matches(/^[0-9]+$/, 'Code must contain only numbers'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data: AuthResponse = await verifyResetCode(values.resetCode);

        if (data.status === 'Success' || data.message === 'success') {
          toast.success("Code verified! You can now reset your password.");
          router.push('/reset-password');
        } else {
          setApiError(data.message || 'The code you entered is invalid or expired');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Network error, please try again.';
        setApiError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-xl p-10 border border-slate-100 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 border shadow-sm rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border-emerald-100/50 dark:border-emerald-800/30">
          <KeyRound size={36} />
        </div>

        <h1 className="mb-2 text-3xl font-black text-slate-900 dark:text-slate-50">Verify Code</h1>
        <p className="mb-8 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Please enter the <span className="font-bold text-slate-700 dark:text-slate-200">6-digit code</span> sent to your email address.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="text-left">
            <input
              {...formik.getFieldProps('resetCode')}
              autoFocus
              maxLength={6}
              placeholder="000000"
              className={`w-full px-4 py-5 text-2xl border outline-none bg-slate-50 dark:bg-slate-800 rounded-2xl transition-all text-center tracking-[0.5em] font-black placeholder:text-slate-200 dark:placeholder:text-slate-600 dark:text-white
                ${formik.touched.resetCode && formik.errors.resetCode
                  ? 'border-red-300 focus:border-red-500 text-red-600'
                  : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20'}`}
            />
            {formik.touched.resetCode && formik.errors.resetCode && (
              <p className="mt-2 text-xs font-bold tracking-wider text-center text-red-500 uppercase">
                {formik.errors.resetCode}
              </p>
            )}
          </div>

          {apiError && (
            <div className="p-4 text-sm font-bold text-red-600 border border-red-100 rounded-2xl bg-red-50 animate-shake">
              {apiError}
            </div>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className="flex justify-center items-center w-full py-4 font-black text-white transition-all rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 shadow-lg shadow-emerald-100 active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify & Proceed'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-8 text-sm font-bold transition-colors text-slate-400 hover:text-emerald-600"
        >
          Didn&apos;t get a code? <span className="underline">Try again</span>
        </button>
      </div>
    </div>
  );
}