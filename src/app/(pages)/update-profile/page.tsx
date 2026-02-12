'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateUserData } from '@/api/auth.api';
import { Loader2, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UpdateProfile() {
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { userName } = useAuth();

  const formik = useFormik({
    initialValues: { name: userName || '', phone: '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Too short').required('Name is required'),
      phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone').required('Phone is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError('');
      try {
        const data = await updateUserData(values);
        if (data.message === 'success') {
          setSuccessMsg('Profile updated successfully!');
          setTimeout(() => router.push('/'), 1500);
        } else {
          setApiError(data.message);
        }
      } catch (err: any) {
        setApiError(err.message || 'Update failed. Try again.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-4 text-emerald-600">
          <UserCircle size={48} />
        </div>
        <h1 className="mb-6 text-2xl font-black text-center text-slate-900">Update Profile</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input {...formik.getFieldProps('name')} placeholder="New Name" className="w-full px-4 py-3 text-sm border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500" />
            {formik.touched.name && formik.errors.name && <p className="mt-1 text-xs font-bold text-red-500">{formik.errors.name}</p>}
          </div>

          <div>
            <input {...formik.getFieldProps('phone')} placeholder="New Phone" className="w-full px-4 py-3 text-sm border rounded-lg outline-none bg-slate-50 border-slate-200 focus:border-emerald-500" />
            {formik.touched.phone && formik.errors.phone && <p className="mt-1 text-xs font-bold text-red-500">{formik.errors.phone}</p>}
          </div>

          {apiError && <p className="p-3 text-sm font-bold text-red-600 border border-red-100 rounded-md bg-red-50">{apiError}</p>}
          {successMsg && <p className="p-3 text-sm font-bold border rounded-md text-emerald-600 bg-emerald-50 border-emerald-100">{successMsg}</p>}

          <button disabled={isLoading} type="submit" className="flex justify-center w-full py-3 font-bold text-white transition-all rounded-lg bg-emerald-600 hover:bg-emerald-700">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}