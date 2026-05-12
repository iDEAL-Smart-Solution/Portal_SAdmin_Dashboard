import SignatureUploader from './SignatureUploaderClean';
import { useState } from 'react';

export default function AdminPrincipalSignature() {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14l-8 6h16l-8-6z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Principal Signature</h3>
          <p className="text-sm text-text-secondary">
            Upload the signature used for report cards and official academic documents.
          </p>
        </div>
      </div>

      <SignatureUploader isPrincipal={true} onUploaded={(url) => setUploadedUrl(url)} />

      {uploadedUrl && (
        <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50 px-3 py-2 text-sm text-primary-700">
          Signature uploaded successfully.
        </div>
      )}
    </section>
  );
}
