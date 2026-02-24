import React, { useRef, useState } from 'react';
import axiosInstance from '../../lib/axios';

interface Props {
  studentId?: string;
  isPrincipal?: boolean;
  onUploaded?: (url: string) => void;
}

export default function SignatureUploader({ studentId, isPrincipal = false, onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) return setError('No file selected');
    if (!file.type.startsWith('image/')) return setError('Only image files are allowed');
    if (file.size > 100 * 1024) return setError('File too large. Maximum allowed size is 100KB.');

    const form = new FormData();
    form.append('file', file as Blob);
    if (studentId) form.append('studentId', studentId);
    form.append('isPrincipal', String(Boolean(isPrincipal)));

    try {
      setIsUploading(true);
      const resp = await axiosInstance.post('/ReportCard/sign', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = resp.data?.url;
      if (url) onUploaded?.(url);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <div className="mb-2 font-medium">{isPrincipal ? 'Principal Signature' : 'Upload Signature'}</div>
      <input ref={fileRef} type="file" accept="image/*" />
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      <div className="mt-3 flex items-center gap-2">
        <button onClick={handleUpload} className="px-3 py-2 bg-primary text-white rounded" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        <button onClick={() => { if (fileRef.current) fileRef.current.value = ''; setError(null);} } className="px-3 py-2 border rounded">
          Clear
        </button>
      </div>
    </div>
  );
}
