import React from 'react';
import SignatureUploader from './SignatureUploader';

export default function AdminPrincipalSignature() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Principal Signature</h3>
      <SignatureUploader isPrincipal={true} onUploaded={(url) => alert('Principal signature uploaded: ' + url)} />
    </div>
  );
}
