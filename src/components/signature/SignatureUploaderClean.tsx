import { useRef, useState } from 'react';
import axiosInstance from '../../lib/axios';

interface Props {
  studentId?: string;
  isPrincipal?: boolean;
  onUploaded?: (url: string) => void;
}

export default function SignatureUploaderClean({ studentId, isPrincipal = false, onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpload = async () => {
    setError(null);
    setSuccessMessage(null);
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
      if (url) {
        onUploaded?.(url);
        setSuccessMessage('Signature uploaded successfully.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-background-secondary p-4">
      <label className="mb-2 block text-sm font-medium text-text-primary">
        {isPrincipal ? 'Select Signature File' : 'Select File'}
      </label>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={() => {
          setError(null);
          setSuccessMessage(null);
        }}
        className="block w-full rounded-lg border border-neutral-300 bg-white text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
      />
      <p className="mt-2 text-xs text-text-tertiary">Accepted: image files only, max size 100KB.</p>

      {error && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      {successMessage && <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={handleUpload} className="rounded-lg bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        <button
          onClick={() => {
            if (fileRef.current) fileRef.current.value = '';
            setError(null);
            setSuccessMessage(null);
          }}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-text-primary transition-colors hover:bg-neutral-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
