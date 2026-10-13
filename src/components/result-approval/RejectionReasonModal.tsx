import React, { useState } from 'react';
import Modal from '../ui/modal';
import { Button } from '../ui/button';

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentUin: string;
  isSubmitting: boolean;
  onConfirm: (reason: string) => Promise<void>;
}

export const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentUin,
  isSubmitting,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setValidationError('Please provide a reason for rejecting this result.');
      return;
    }

    setValidationError(null);
    await onConfirm(trimmed);
    setReason('');
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setReason('');
    setValidationError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Student Result"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-red-50 p-3 border border-red-100">
          <p className="text-xs text-red-700 font-medium">
            Rejecting result for:
          </p>
          <p className="text-sm font-semibold text-red-900 mt-0.5">
            {studentName} <span className="font-mono text-xs text-red-700 font-normal">({studentUin})</span>
          </p>
          <p className="text-xs text-red-600 mt-1">
            This will mark only this student's result as rejected. The teacher will be able to correct and resubmit the existing record.
          </p>
        </div>

        <div>
          <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            id="rejectionReason"
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Explain why this student result is being rejected (e.g. Exam score does not match submitted script)..."
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
              validationError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
            disabled={isSubmitting}
            required
          />
          {validationError && (
            <p className="mt-1 text-xs text-red-600">{validationError}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={isSubmitting || !reason.trim()}
          >
            {isSubmitting ? 'Rejecting...' : 'Reject Result'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectionReasonModal;
